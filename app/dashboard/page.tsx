import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { PacientesGrid } from "@/components/pacientes-grid"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <Suspense fallback={<DashboardSkeleton />}>
        <PacientesGrid />
      </Suspense>
    </div>
  )
}
