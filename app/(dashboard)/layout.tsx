import { Header } from "@/shared/components/shared"
import { DashboardMenu } from "@/shared/components/shared/dashboard/dashboard-menu"
import { Suspense } from "react"

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
    <main className="flex flex-col w-full">
      <Suspense>
          <Header />
      </Suspense>
      <div className="flex w-full">
        <aside className="w-64  bg-white p-4 border-r border-gray-200">
          <DashboardMenu />
        </aside>
        <div className='w-full'>{children}</div>
      </div>
      
    </main>
  )
}
