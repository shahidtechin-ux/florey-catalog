import DashboardClient from './DashboardClient';

export const metadata = {
  title: 'Admin Dashboard | FLOREY', 
  // Ye main layout ke template ke sath judkar 'Admin Dashboard | Shajjad Electronics' ban jayega
};

export default function AdminPage() {
  return <DashboardClient />;
}