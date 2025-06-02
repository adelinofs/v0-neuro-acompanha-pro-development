"use client"

import { useState, useEffect } from "react"
import { PacienteCard } from "@/components/paciente-card"
import { getPacientes } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Database, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PacientesGrid() {
  const [pacientes, setPacientes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPacientes = async () => {
    try {
      setIsLoading(true)
      setError(null)

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
      <div className="space-y-6">
        {/* Skeleton para estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>

        {/* Skeleton para cards de pacientes */}
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
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de Conexão</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{error}</p>
            <p className="text-sm">
              Verifique se as variáveis de ambiente do Supabase estão configuradas corretamente:
            </p>
            <ul className="text-sm list-disc list-inside space-y-1">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button onClick={loadPacientes} variant="outline">
            <Database className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
          <Button asChild>
            <Link href="/dashboard/teste-conexao">Testar Conexão</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (pacientes.length === 0) {
    return (
      <div className="space-y-6">
        {/* Estatísticas vazias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pacientes Ativos</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-yellow-600">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pacientes Inativos</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Altas Médicas</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total de Pacientes</div>
          </div>
        </div>

        {/* Estado vazio */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Nenhum paciente encontrado</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>Você ainda não possui pacientes cadastrados.</p>
            <Button asChild>
              <Link href="/dashboard/pacientes/novo">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Paciente
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{pacientes.filter((p) => p.status === "ativo").length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pacientes Ativos</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">
            {pacientes.filter((p) => p.status === "inativo").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pacientes Inativos</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{pacientes.filter((p) => p.status === "alta").length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Altas Médicas</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">{pacientes.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total de Pacientes</div>
        </div>
      </div>

      {/* Link para ver todos os pacientes */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Pacientes Recentes</h2>
        <Button asChild variant="outline">
          <Link href="/dashboard/pacientes">Ver Todos os Pacientes</Link>
        </Button>
      </div>

      {/* Grid de pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pacientes.slice(0, 6).map((paciente) => (
          <PacienteCard key={paciente.id} paciente={paciente} />
        ))}
      </div>
    </div>
  )
}
