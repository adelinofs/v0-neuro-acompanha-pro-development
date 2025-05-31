"use client"

import { useState, useEffect } from "react"
import { PacienteCard } from "@/components/paciente-card"
import { getPacientes } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function PacientesGrid() {
  const [pacientes, setPacientes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPacientes = async () => {
    try {
      // Usar o UUID válido que inserimos no banco
      const usuarioId = "00000000-0000-0000-0000-000000000000"
      const { data, error } = await getPacientes(usuarioId)

      if (error) {
        throw new Error(error.message)
      }

      setPacientes(data || [])
    } catch (err: any) {
      console.error("Erro ao carregar pacientes:", err)
      setError(err.message || "Erro ao carregar pacientes")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPacientes()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-1" />
              </div>
              <div className="flex justify-between pt-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (pacientes.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Nenhum paciente encontrado</AlertTitle>
        <AlertDescription>Você ainda não possui pacientes cadastrados.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pacientes.map((paciente) => (
        <PacienteCard key={paciente.id} paciente={paciente} />
      ))}
    </div>
  )
}
