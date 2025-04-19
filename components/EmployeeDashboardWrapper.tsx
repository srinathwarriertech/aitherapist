'use client'

import dynamic from 'next/dynamic'

const EmployeeDashboard = dynamic(() => import('./EmployeeDashboard'), { ssr: false })

export default function EmployeeDashboardWrapper() {
  return <EmployeeDashboard />
}
