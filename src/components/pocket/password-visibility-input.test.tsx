import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PasswordVisibilityInput } from './password-visibility-input';

describe('PasswordVisibilityInput', () => {
  it('starts hidden and toggles visibility without changing the value', () => {
    const onChange = vi.fn();
    render(
      <PasswordVisibilityInput
        label="New password"
        value="secret-value"
        onChange={onChange}
        showLabel="Show password"
        hideLabel="Hide password"
      />,
    );

    const input = screen.getByLabelText('New password') as HTMLInputElement;
    expect(input.type).toBe('password');
    expect(input.value).toBe('secret-value');

    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input.type).toBe('text');
    expect(input.value).toBe('secret-value');

    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input.type).toBe('password');
    expect(input.value).toBe('secret-value');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps the new-password and confirmation visibility controls independent', () => {
    render(
      <>
        <PasswordVisibilityInput label="New password" value="first-secret" onChange={() => {}} showLabel="Show password" hideLabel="Hide password" />
        <PasswordVisibilityInput label="Confirm password" value="second-secret" onChange={() => {}} showLabel="Show password" hideLabel="Hide password" />
      </>,
    );

    const newPassword = screen.getByLabelText('New password') as HTMLInputElement;
    const confirmation = screen.getByLabelText('Confirm password') as HTMLInputElement;
    const [showButtons] = screen.getAllByRole('button', { name: 'Show password' });

    fireEvent.click(showButtons);
    expect(newPassword.type).toBe('text');
    expect(confirmation.type).toBe('password');
    expect(newPassword.value).toBe('first-secret');
    expect(confirmation.value).toBe('second-secret');
  });

  it('forwards typed changes to the controlled field', () => {
    const onChange = vi.fn();
    render(
      <PasswordVisibilityInput
        label="New password"
        value=""
        onChange={onChange}
        showLabel="Show password"
        hideLabel="Hide password"
      />,
    );
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'new-secret' } });
    expect(onChange).toHaveBeenCalledWith('new-secret');
  });
});
