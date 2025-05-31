"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { MarcoForm } from "@/components/forms/marco-form"
import { MarcoCard } from "@/components/marco-card"
import type { MarcoDesenvolvimento } from "@/lib/supabase"

interface MarcosTabProps {
  pacienteId: string
}

// Dados de exemplo
const marcosExemplo: MarcoDesenvolvimento[] = [
  {
    id: "1",
    paciente_id: "1",
    categoria: "Comunicação",
    titulo: "Primeira palavra funcional",
    descricao: 'Paciente conseguiu usar a palavra "água" de forma funcional para solicitar',
    data_alcancado: "2024-01-10",
    status: "alcancado",
    criado_em: "2024-01-01T00:00:00Z",
    atualizado_em: "2024-01-10T00:00:00Z",
  },
  {
    id: "2",
    paciente_id: "1",
    categoria: "Social",
    titulo: "Contato visual sustentado",
    descricao: "Manter contato visual por pelo menos 3 segundos durante interações",
    status: "em_progresso",
    criado_em: "2024-01-01T00:00:00Z",
    atualizado_em: "2024-01-15T00:00:00Z",
  },
  {
    id: "3",
    paciente_id: "1",
    categoria: "Motor",
    titulo: "Coordenação motora fina",
    descricao: "Conseguir segurar e usar utensílios de desenho adequadamente",
    status: "pendente",
    criado_em: "2024-01-01T00:00:00Z",
    atualizado_em: "2024-01-01T00:00:00Z",
  },
]

export function MarcosTab({ pacienteId }: MarcosTabProps) {
  const [showForm, setShowForm] = useState(false)
  const [marcos, setMarcos] = useState<MarcoDesenvolvimento[]>(marcosExemplo)

  const handleAddMarco = (novoMarco: Omit<MarcoDesenvolvimento, "id" | "criado_em" | "atualizado_em">) => {
    const marco: MarcoDesenvolvimento = {
      ...novoMarco,
      id: Date.now().toString(),
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    }
    setMarcos([marco, ...marcos])
    setShowForm(false)
  }

  const categorias = ["Comunicação", "Social", "Motor", "Cognitivo", "Comportamental"]
  const marcosPorCategoria = categorias.map((categoria) => ({
    categoria,
    marcos: marcos.filter((marco) => marco.categoria === categoria),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Marcos de Desenvolvimento</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Acompanhe o progresso e conquistas do paciente</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Marco
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Marco de Desenvolvimento</CardTitle>
            <CardDescription>Defina um novo objetivo ou registre uma conquista</CardDescription>
          </CardHeader>
          <CardContent>
            <MarcoForm pacienteId={pacienteId} onSubmit={handleAddMarco} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {marcosPorCategoria.map(({ categoria, marcos: marcosCategoria }) => (
          <div key={categoria}>
            <h4 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">{categoria}</h4>
            {marcosCategoria.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marcosCategoria.map((marco) => (
                  <MarcoCard key={marco.id} marco={marco} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum marco definido para esta categoria</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
