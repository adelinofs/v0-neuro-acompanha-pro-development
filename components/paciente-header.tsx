"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Phone, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Paciente } from "@/lib/supabase"
import { calculateAge, formatDate } from "@/lib/utils"

interface PacienteHeaderProps {
  pacienteId: string
}

// Dados de exemplo para diferentes pacientes
const pacientesExemplo: Record<string, Paciente> = {
  "1": {
    id: "1",
    nome: "Ana Silva",
    data_nascimento: "2015-03-15",
    responsavel: "Maria Silva",
    telefone: "(11) 99999-9999",
    email: "maria.silva@email.com",
    diagnostico: "TEA - Transtorno do Espectro Autista",
    status: "ativo",
    usuario_id: "1",
    criado_em: "2024-01-01T00:00:00Z",
    atualizado_em: "2024-01-01T00:00:00Z",
  },
  "2": {
    id: "2",
    nome: "João Santos",
    data_nascimento: "2012-08-22",
    responsavel: "Carlos Santos",
    telefone: "(11) 88888-8888",
    email: "carlos.santos@email.com",
    diagnostico: "TDAH - Transtorno do Déficit de Atenção",
    status: "ativo",
    usuario_id: "1",
    criado_em: "2024-01-01T00:00:00Z",
    atualizado_em: "2024-01-01T00:00:00Z",
  },
  "3": {
    id: "3",
    nome: "Beatriz Costa",
    data_nascimento: "2018-11-10",
    responsavel: "Ana Costa",
    telefone: "(11) 77777-7777",
    email: "ana.costa@email.com",
    diagnostico: "Atraso no Desenvolvimento",
    status: "ativo",
    usuario_id: "1",
    criado_em: "2024-01-01T00:00:00Z",
    atualizado_em: "2024-01-01T00:00:00Z",
  },
  "4": {
    id: "4",
    nome: "Pedro Oliveira",
    data_nascimento: "2016-05-20",
    responsavel: "Lucia Oliveira",
    telefone: "(11) 66666-6666",
    email: "lucia.oliveira@email.com",
    diagnostico: "Síndrome de Down",
    status: "ativo",
    usuario_id: "1",
    criado_em: "2024-01-01T00:00:00Z",
    atualizado_em: "2024-01-01T00:00:00Z",
  },
  "5": {
    id: "5",
    nome: "Sofia Mendes",
    data_nascimento: "2017-12-03",
    responsavel: "Roberto Mendes",
    telefone: "(11) 55555-5555",
    email: "roberto.mendes@email.com",
    diagnostico: "Dislexia",
    status: "inativo",
    usuario_id: "1",
    criado_em: "2024-01-01T00:00:00Z",
    atualizado_em: "2024-01-01T00:00:00Z",
  },
  "6": {
    id: "6",
    nome: "Lucas Ferreira",
    data_nascimento: "2014-09-18",
    responsavel: "Patricia Ferreira",
    telefone: "(11) 44444-4444",
    email: "patricia.ferreira@email.com",
    diagnostico: "Paralisia Cerebral",
    status: "alta",
    usuario_id: "1",
    criado_em: "2024-01-01T00:00:00Z",
    atualizado_em: "2024-01-01T00:00:00Z",
  },
}

export function PacienteHeader({ pacienteId }: PacienteHeaderProps) {
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular busca do paciente
    const loadPaciente = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const pacienteData = pacientesExemplo[pacienteId]
        if (pacienteData) {
          setPaciente(pacienteData)
        }
      } catch (error) {
        console.error("Erro ao carregar paciente:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPaciente()
  }, [pacienteId])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!paciente) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Paciente não encontrado</p>
            <Link href="/dashboard">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  const idade = calculateAge(paciente.data_nascimento)
  const iniciais = paciente.nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "inativo":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "alta":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(paciente.status)}>
              {paciente.status.charAt(0).toUpperCase() + paciente.status.slice(1)}
            </Badge>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="text-lg">{iniciais}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{paciente.nome}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {idade} anos • Nascido em {formatDate(paciente.data_nascimento)}
            </p>
            <div className="flex items-center space-x-4 mt-2">
              {paciente.telefone && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4 mr-1" />
                  {paciente.telefone}
                </div>
              )}
              {paciente.email && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4 mr-1" />
                  {paciente.email}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Responsável</h3>
            <p className="text-gray-600 dark:text-gray-400">{paciente.responsavel}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Diagnóstico</h3>
            <p className="text-gray-600 dark:text-gray-400">{paciente.diagnostico}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Paciente desde</h3>
            <p className="text-gray-600 dark:text-gray-400">{formatDate(paciente.criado_em)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
