import { act, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  register: vi.fn(),
  googleLogin: vi.fn(),
}));
vi.mock("@/lib/api", () => ({
  api: { login: mocks.login, register: mocks.register, googleLogin: mocks.googleLogin },
  clearCachedMoneyData: vi.fn(),
  decodeToken: () => null,
}));
vi.mock("@/lib/i18n", () => ({ useI18n: () => ({ t: (k: string) => k }) }));
vi.mock("@/components/cartoon", () => ({ LogoMark: () => null, WalletFriend: () => null }));

import { AuthProvider, useAuth } from "@/lib/auth";
import {
  LOGIN_OVERLAY_LOADING_MAX_MS,
  LOGIN_OVERLAY_MIN_MS,
  LoginOverlay,
  useSettleLoginTransition,
} from "./login-overlay";

const user = { id: "u1", email: "a@b.co", username: "ab" };
type ReadyState = { data: "fetching" | "idle" | "paused"; prefs: boolean };
let auth: ReturnType<typeof useAuth>;
let setReady: (state: ReadyState) => void;

function FakeDashboard() {
  const [ready, set] = useState<ReadyState>({ data: "fetching", prefs: false });
  setReady = set;
  useSettleLoginTransition(ready.prefs, ready.data);
  return null;
}

function Harness() {
  auth = useAuth();
  return (
    <>
      {auth.status === "signedIn" && <FakeDashboard />}
      <LoginOverlay />
    </>
  );
}

const overlay = () => screen.queryByTestId("login-overlay");

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  render(
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <Harness />
      </AuthProvider>
    </QueryClientProvider>,
  );
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("login loading overlay", () => {
  it("shows during password login and stays until data and preferences are both ready", async () => {
    const pending = deferred<{ token: string; user: typeof user }>();
    mocks.login.mockReturnValue(pending.promise);

    let loginPromise!: Promise<void>;
    act(() => {
      loginPromise = auth.login("a@b.co", "secret123");
    });

    expect(overlay()?.textContent).toContain("login.signingIn");
    expect(overlay()?.getAttribute("aria-busy")).toBe("true");

    await act(async () => {
      pending.resolve({ token: "t", user });
      await loginPromise;
    });
    expect(overlay()?.textContent).toContain("login.preparing");

    act(() => setReady({ data: "idle", prefs: false }));
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });
    expect(overlay()).not.toBeNull();

    act(() => setReady({ data: "idle", prefs: true }));
    await act(async () => {
      vi.advanceTimersByTime(0);
    });
    expect(overlay()).toBeNull();
  });

  it("keeps the overlay visible while authentication and a slow dashboard load exceed 45 seconds", async () => {
    const pending = deferred<{ token: string; user: typeof user }>();
    mocks.login.mockReturnValue(pending.promise);

    let loginPromise!: Promise<void>;
    act(() => {
      loginPromise = auth.login("a@b.co", "secret123");
    });

    await act(async () => {
      vi.advanceTimersByTime(60_000);
    });
    expect(overlay()).not.toBeNull();

    await act(async () => {
      pending.resolve({ token: "t", user });
      await loginPromise;
    });
    await act(async () => {
      vi.advanceTimersByTime(60_000);
    });
    expect(overlay()).not.toBeNull();

    act(() => setReady({ data: "idle", prefs: true }));
    await act(async () => {
      vi.advanceTimersByTime(0);
    });
    expect(overlay()).toBeNull();
  });

  it("keeps a fast login visible for the short minimum, then hides without extra delay", async () => {
    mocks.login.mockResolvedValue({ token: "t", user });

    await act(async () => {
      await auth.login("a@b.co", "secret123");
    });
    act(() => setReady({ data: "idle", prefs: true }));

    await act(async () => {
      vi.advanceTimersByTime(LOGIN_OVERLAY_MIN_MS - 50);
    });
    expect(overlay()).not.toBeNull();

    await act(async () => {
      vi.advanceTimersByTime(50);
    });
    expect(overlay()).toBeNull();
    expect(LOGIN_OVERLAY_MIN_MS).toBeGreaterThanOrEqual(700);
    expect(LOGIN_OVERLAY_MIN_MS).toBeLessThanOrEqual(850);
  });

  it("clears after the dashboard loading safety limit if readiness never arrives", async () => {
    mocks.login.mockResolvedValue({ token: "t", user });

    await act(async () => {
      await auth.login("a@b.co", "secret123");
    });
    await act(async () => {
      vi.advanceTimersByTime(LOGIN_OVERLAY_LOADING_MAX_MS - 1);
    });
    expect(overlay()).not.toBeNull();

    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(overlay()).toBeNull();
  });

  it("treats a paused offline data query as settled once preferences have loaded", async () => {
    mocks.login.mockResolvedValue({ token: "t", user });

    await act(async () => {
      await auth.login("a@b.co", "secret123");
    });
    act(() => setReady({ data: "paused", prefs: true }));

    await act(async () => {
      vi.advanceTimersByTime(LOGIN_OVERLAY_MIN_MS);
    });
    expect(overlay()).toBeNull();
  });

  it("covers Google sign-in the same way", async () => {
    mocks.googleLogin.mockResolvedValue({ token: "t", user });

    await act(async () => {
      await auth.loginWithGoogle("google-cred");
    });
    expect(mocks.googleLogin).toHaveBeenCalledWith("google-cred");
    expect(overlay()).not.toBeNull();

    act(() => setReady({ data: "idle", prefs: true }));
    await act(async () => {
      vi.advanceTimersByTime(LOGIN_OVERLAY_MIN_MS);
    });
    expect(overlay()).toBeNull();
  });

  it("covers registration with the same transition", async () => {
    mocks.register.mockResolvedValue({ token: "t", user });

    await act(async () => {
      await auth.register("a@b.co", "secret123", "ab");
    });
    expect(mocks.register).toHaveBeenCalledWith("a@b.co", "secret123", "ab");
    expect(overlay()).not.toBeNull();
  });

  it("clears immediately when login or Google auth fails, so the form error can show", async () => {
    mocks.login.mockRejectedValue(new Error("bad"));
    await act(async () => {
      await expect(auth.login("a@b.co", "wrong")).rejects.toThrow("bad");
    });
    expect(overlay()).toBeNull();
    expect(auth.status).toBe("signedOut");

    mocks.googleLogin.mockRejectedValue(new Error("nope"));
    await act(async () => {
      await expect(auth.loginWithGoogle("x")).rejects.toThrow("nope");
    });
    expect(overlay()).toBeNull();
  });

  it("does not appear for guest entry", () => {
    act(() => auth.startGuest("g1"));
    expect(auth.status).toBe("signedIn");
    expect(overlay()).toBeNull();
  });
});
