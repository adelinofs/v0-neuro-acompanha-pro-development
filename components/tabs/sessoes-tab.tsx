"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Calendar } from "lucide-react"
import { SessaoForm } from "@/components/forms/sessao-form"
import { SessaoCard } from "@/components/sessao-card"
import { useToast } from "@/hooks/use-toast"
import type { Sessao } from "@/lib/supabase"

interface SessoesTabProps {
  pacienteId: string
}

// Dados de exemplo mais robustos
const sessoesExemplo: Sessao[] = [
  {
    id: "1",
    paciente_id: "1",
    data_sessao: "2024-01-15T10:00:00Z",
    duracao: 60,
    observacoes:
      "Sessão produtiva, paciente demonstrou boa participação nas atividades propostas. Trabalhou bem com materiais visuais.",
    objetivos: "Trabalhar comunicação verbal e interação social através de jogos estruturados",
    resultados:
      "Melhora significativa na comunicação não-verbal, conseguiu manter contato visual por períodos mais longos",
    status: "realizada",
    criado_em: "2024-01-15T10:00:00Z",
    atualizado_em: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    paciente_id: "1",
    data_sessao: "2024-01-08T10:00:00Z",
    duracao: 45,
    observacoes:
      "Paciente apresentou resistência inicial, mas colaborou durante a sessão. Mostrou interesse em atividades com música.",
    objetivos: "Desenvolver habilidades motoras finas através de atividades de coordenação",
    resultados: "Progresso gradual nas atividades de coordenação, conseguiu completar 3 de 5 exercícios propostos",
    status: "realizada",
    criado_em: "2024-01-08T10:00:00Z",
    atualizado_em: "2024-01-08T10:00:00Z",
  },
  {
    id: "3",
    paciente_id: "1",
    data_sessao: "2024-01-22T14:00:00Z",
    duracao: 60,
    observacoes: "",
    objetivos: "Continuar trabalho de comunicação e introduzir atividades de grupo",
    resultados: "",
    status: "agendada",
    criado_em: "2024-01-20T10:00:00Z",
    atualizado_em: "2024-01-20T10:00:00Z",
  },
  {
    id: "4",
    paciente_id: "1",
    data_sessao: "2024-01-01T09:00:00Z",
    duracao: 30,
    observacoes: "Sessão cancelada devido a indisposição do paciente",
    objetivos: "Avaliação inicial de habilidades sociais",
    resultados: "",
    status: "cancelada",
    criado_em: "2024-01-01T09:00:00Z",
    atualizado_em: "2024-01-01T09:00:00Z",
  },
]

export function SessoesTab({ pacienteId }: SessoesTabProps) {
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingSessao, setEditingSessao] = useState<Sessao | null>(null)
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    loadSessoes()
  }, [pacienteId])

  const loadSessoes = async () => {
    try {
      setLoading(true)
      // Simular carregamento do banco de dados
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Filtrar sessões pelo paciente
      const sessoesPaciente = sessoesExemplo.filter((s) => s.paciente_id === pacienteId)
      setSessoes(sessoesPaciente)
    } catch (error) {
      console.error("Erro ao carregar sessões:", error)
      toast({
        title: "Erro ao carregar sessões",
        description: "Não foi possível carregar as sessões do paciente",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddSessao = async (novaSessao: Omit<Sessao, "id" | "criado_em" | "atualizado_em">) => {
    try {
      const sessao: Sessao = {
        ...novaSessao,
        id: Date.now().toString(),
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
      }

      setSessoes((prev) => [sessao, ...prev])
      setShowForm(false)
      setEditingSessao(null)

      // Simular salvamento no banco
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error("Erro ao salvar sessão:", error)
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a sessão",
        variant: "destructive",
      })
    }
  }

  const handleEditSessao = (sessao: Sessao) => {
    setEditingSessao(sessao)
    setShowForm(true)
  }

  const handleUpdateSessao = async (sessaoAtualizada: Omit<Sessao, "id" | "criado_em" | "atualizado_em">) => {
    if (!editingSessao) return

    try {
      const sessaoCompleta: Sessao = {
        ...sessaoAtualizada,
        id: editingSessao.id,
        criado_em: editingSessao.criado_em,
        atualizado_em: new Date().toISOString(),
      }

      setSessoes((prev) => prev.map((s) => (s.id === editingSessao.id ? sessaoCompleta : s)))
      setShowForm(false)
      setEditingSessao(null)

      // Simular atualização no banco
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error("Erro ao atualizar sessão:", error)
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a sessão",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSessao = async (sessaoId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta sessão?")) return

    try {
      setSessoes((prev) => prev.filter((s) => s.id !== sessaoId))

      toast({
        title: "Sessão excluída",
        description: "A sessão foi excluída com sucesso",
      })

      // Simular exclusão no banco
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error("Erro ao excluir sessão:", error)
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a sessão",
        variant: "destructive",
      })
    }
  }

  const filteredSessoes = sessoes
    .filter((sessao) => {
      const matchesSearch =
        searchTerm === "" ||
        sessao.objetivos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sessao.observacoes?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "todos" || sessao.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const dateA = new Date(a.data_sessao).getTime()
      const dateB = new Date(b.data_sessao).getTime()
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })

  const getStatusStats = () => {
    const realizadas = sessoes.filter((s) => s.status === "realizada").length
    const agendadas = sessoes.filter((s) => s.status === "agendada").length
    const canceladas = sessoes.filter((s) => s.status === "cancelada").length

    return { realizadas, agendadas, canceladas, total: sessoes.length }
  }

  const stats = getStatusStats()

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Sessões de Terapia</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Registre e acompanhe as sessões realizadas com o paciente
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingSessao(null)
            setShowForm(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Sessão
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.realizadas}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Realizadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.agendadas}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Agendadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.canceladas}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Canceladas</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por objetivos ou observações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Status</SelectItem>
                  <SelectItem value="realizada">Realizadas</SelectItem>
                  <SelectItem value="agendada">Agendadas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                <SelectTrigger className="w-40">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Mais Recentes</SelectItem>
                  <SelectItem value="asc">Mais Antigas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingSessao ? "Editar Sessão" : "Registrar Nova Sessão"}</CardTitle>
            <CardDescription>
              {editingSessao
                ? "Atualize as informações da sessão"
                : "Preencha os detalhes da sessão realizada ou agendada"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SessaoForm
              pacienteId={pacienteId}
              onSubmit={editingSessao ? handleUpdateSessao : handleAddSessao}
              onCancel={() => {
                setShowForm(false)
                setEditingSessao(null)
              }}
              editingSessao={editingSessao}
            />
          </CardContent>
        </Card>
      )}

      {/* Lista de Sessões */}
      <div className="space-y-4">
        {filteredSessoes.length > 0 ? (
          filteredSessoes.map((sessao) => (
            <SessaoCard key={sessao.id} sessao={sessao} onEdit={handleEditSessao} onDelete={handleDeleteSessao} />
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter !== "todos"
                  ? "Nenhuma sessão encontrada com os filtros aplicados"
                  : "Nenhuma sessão registrada ainda"}
              </p>
              {!searchTerm && statusFilter === "todos" && (
                <Button variant="outline" onClick={() => setShowForm(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Primeira Sessão
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
