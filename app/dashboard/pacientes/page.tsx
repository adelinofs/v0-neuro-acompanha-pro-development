"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PacientesTable } from "@/components/pacientes-table"
import { getPacientes, type Paciente } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadPacientes()
  }, [])

  const loadPacientes = async () => {
    try {
      setIsLoading(true)
      // Usar o UUID válido que inserimos no banco
      const usuarioId = "00000000-0000-0000-0000-000000000000"
      const { data, error } = await getPacientes(usuarioId)

      if (error) {
        throw new Error(error.message)
      }

      setPacientes(data || [])
    } catch (err: any) {
      console.error("Erro ao carregar pacientes:", err)
      toast({
        title: "Erro ao carregar pacientes",
        description: err.message || "Não foi possível carregar a lista de pacientes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie todos os seus pacientes em um só lugar</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/pacientes/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Paciente
          </Link>
        </Button>
      </div>

      {/* Tabela de Pacientes */}
      <PacientesTable pacientes={pacientes} isLoading={isLoading} />
    </div>
  )
}
