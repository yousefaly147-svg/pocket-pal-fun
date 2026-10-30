import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/ar')({
  beforeLoad: ({ location }) => {
    if (location.pathname === '/ar') {
      throw redirect({ to: '/ar/' });
    }
  },
  component: ArabicLayout,
});

function ArabicLayout() {
  return <Outlet />;
}
