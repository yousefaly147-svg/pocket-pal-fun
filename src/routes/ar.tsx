import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/ar')({
  component: ArabicLayout,
});

function ArabicLayout() {
  return <Outlet />;
}
