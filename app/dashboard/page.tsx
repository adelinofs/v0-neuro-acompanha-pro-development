"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { getDashboardStats } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    pacientes: 0,
    sessoes: 0,
    marcos: 0,
    marcosAlcancados: 0,
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      // Usar o UUID válido que inserimos no banco
      const usuarioId = "00000000-0000-0000-0000-000000000000"
      const data = await getDashboardStats(usuarioId)
      setStats(data)
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as estatísticas do dashboard",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Visão geral dos seus pacientes e atividades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pacientes}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Pacientes cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões Realizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sessoes}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total de atendimentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marcos Definidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.marcos}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Objetivos estabelecidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marcos Alcançados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.marcosAlcancados}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {stats.marcos > 0
                ? `${Math.round((stats.marcosAlcancados / stats.marcos) * 100)}% de sucesso`
                : "Nenhum marco definido"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
