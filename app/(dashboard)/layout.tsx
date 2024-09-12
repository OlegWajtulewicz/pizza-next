import { DashboardMenu } from "@/shared/components/shared/dashboard/dashboard-menu"

export const metadata = {
  title: 'Pizza Next | Dashboard',
  description: 'Административная панель для управления Pizza Next',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex w-full">
      <aside className="w-64  h-screen bg-white p-4 border-r border-gray-200">
        <DashboardMenu />
      </aside>
      <div>{children}</div>
    </main>
  )
}
