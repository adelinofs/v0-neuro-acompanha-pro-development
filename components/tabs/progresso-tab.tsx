"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { MetricaProgresso } from "@/lib/supabase"

interface ProgressoTabProps {
  pacienteId: string
}

// Dados de exemplo para o gráfico
const metricasExemplo: MetricaProgresso[] = [
  {
    id: "1",
    paciente_id: "1",
    categoria: "Comunicação",
    valor: 3,
    data_registro: "2024-01-01",
    observacao: "Avaliação inicial",
    criado_em: "2024-01-01T00:00:00Z",
    atualizado_em: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    paciente_id: "1",
    categoria: "Comunicação",
    valor: 4,
    data_registro: "2024-01-15",
    observacao: "Melhora na comunicação verbal",
    criado_em: "2024-01-15T00:00:00Z",
    atualizado_em: "2024-01-15T00:00:00Z",
  },
  {
    id: "3",
    paciente_id: "1",
    categoria: "Comunicação",
    valor: 5,
    data_registro: "2024-02-01",
    observacao: "Progresso contínuo",
    criado_em: "2024-02-01T00:00:00Z",
    atualizado_em: "2024-02-01T00:00:00Z",
  },
  {
    id: "4",
    paciente_id: "1",
    categoria: "Social",
    valor: 2,
    data_registro: "2024-01-01",
    observacao: "Avaliação inicial",
    criado_em: "2024-01-01T00:00:00Z",
    atualizado_em: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    paciente_id: "1",
    categoria: "Social",
    valor: 3,
    data_registro: "2024-01-15",
    observacao: "Pequena melhora na interação",
    criado_em: "2024-01-15T00:00:00Z",
    atualizado_em: "2024-01-15T00:00:00Z",
  },
  {
    id: "6",
    paciente_id: "1",
    categoria: "Social",
    valor: 4,
    data_registro: "2024-02-01",
    observacao: "Melhora significativa",
    criado_em: "2024-02-01T00:00:00Z",
    atualizado_em: "2024-02-01T00:00:00Z",
  },
]

export function ProgressoTab({ pacienteId }: ProgressoTabProps) {
  const [categoria, setCategoria] = useState<string>("Comunicação")
  const [metricas, setMetricas] = useState<MetricaProgresso[]>([])

  useEffect(() => {
    // Filtrar métricas pela categoria selecionada
    const metricasFiltradas = metricasExemplo.filter((m) => m.categoria === categoria)
    setMetricas(metricasFiltradas)
  }, [categoria])

  const categorias = ["Comunicação", "Social", "Motor", "Cognitivo", "Comportamental"]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Progresso do Paciente</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Visualize a evolução do paciente ao longo do tempo</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gráfico de Progresso</CardTitle>
            <div className="w-48">
              <Label htmlFor="categoria" className="sr-only">
                Categoria
              </Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            {metricas.length > 0 ? (
              <div className="w-full h-full flex flex-col justify-end">
                <div className="flex items-end justify-around h-64 border-b border-l border-gray-300 dark:border-gray-600">
                  {metricas.map((metrica, index) => (
                    <div key={metrica.id} className="flex flex-col items-center">
                      <div
                        className="w-12 bg-blue-500 rounded-t transition-all duration-300"
                        style={{ height: `${(metrica.valor / 10) * 100}%`, minHeight: "4px" }}
                      ></div>
                      <div className="mt-2 text-xs text-center text-gray-600 dark:text-gray-400">
                        {new Date(metrica.data_registro).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 px-4 text-gray-500 dark:text-gray-400">
                  <div className="text-sm">0</div>
                  <div className="text-sm">5</div>
                  <div className="text-sm">10</div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p>Nenhum dado disponível para esta categoria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes das Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          {metricas.length > 0 ? (
            <div className="space-y-4">
              {metricas.map((metrica) => (
                <div key={metrica.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{new Date(metrica.data_registro).toLocaleDateString("pt-BR")}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{metrica.observacao}</p>
                    </div>
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                      Nível {metrica.valor}/10
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Nenhuma avaliação registrada para esta categoria
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
