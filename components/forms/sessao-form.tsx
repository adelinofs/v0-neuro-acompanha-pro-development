"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, Target, FileText, CheckCircle } from "lucide-react"
import type { Sessao } from "@/lib/supabase"

interface SessaoFormProps {
  pacienteId: string
  onSubmit: (sessao: Omit<Sessao, "id" | "criado_em" | "atualizado_em">) => void
  onCancel: () => void
  editingSessao?: Sessao | null
}

interface FormErrors {
  data_sessao?: string
  duracao?: string
  objetivos?: string
  observacoes?: string
}

export function SessaoForm({ pacienteId, onSubmit, onCancel, editingSessao }: SessaoFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const [formData, setFormData] = useState({
    data_sessao: editingSessao
      ? new Date(editingSessao.data_sessao).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    duracao: editingSessao?.duracao?.toString() || "60",
    observacoes: editingSessao?.observacoes || "",
    objetivos: editingSessao?.objetivos || "",
    resultados: editingSessao?.resultados || "",
    status: editingSessao?.status || ("realizada" as const),
  })

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validar data da sessão
    if (!formData.data_sessao) {
      newErrors.data_sessao = "Data e hora da sessão são obrigatórias"
    } else {
      const sessaoDate = new Date(formData.data_sessao)
      const now = new Date()
      if (sessaoDate > now) {
        // Se for no futuro, deve ser agendada
        if (formData.status === "realizada") {
          newErrors.data_sessao = "Sessões futuras devem ter status 'Agendada'"
        }
      }
    }

    // Validar duração
    if (!formData.duracao) {
      newErrors.duracao = "Duração é obrigatória"
    } else {
      const duracao = Number.parseInt(formData.duracao)
      if (duracao < 15 || duracao > 240) {
        newErrors.duracao = "Duração deve estar entre 15 e 240 minutos"
      }
    }

    // Validar objetivos para sessões realizadas
    if (formData.status === "realizada" && !formData.objetivos.trim()) {
      newErrors.objetivos = "Objetivos são obrigatórios para sessões realizadas"
    }

    // Validar observações para sessões realizadas
    if (formData.status === "realizada" && !formData.observacoes.trim()) {
      newErrors.observacoes = "Observações são obrigatórias para sessões realizadas"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Erro na validação",
        description: "Por favor, corrija os erros no formulário",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simular delay de submissão
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const sessao: Omit<Sessao, "id" | "criado_em" | "atualizado_em"> = {
        paciente_id: pacienteId,
        data_sessao: new Date(formData.data_sessao).toISOString(),
        duracao: Number.parseInt(formData.duracao),
        observacoes: formData.observacoes.trim(),
        objetivos: formData.objetivos.trim(),
        resultados: formData.resultados.trim(),
        status: formData.status,
      }

      onSubmit(sessao)

      toast({
        title: editingSessao ? "Sessão atualizada!" : "Sessão registrada!",
        description: editingSessao
          ? "As informações da sessão foram atualizadas com sucesso."
          : "A nova sessão foi registrada com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao salvar sessão:", error)
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a sessão. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="data_sessao" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Data e Hora da Sessão *
          </Label>
          <Input
            id="data_sessao"
            type="datetime-local"
            value={formData.data_sessao}
            onChange={(e) => handleInputChange("data_sessao", e.target.value)}
            className={errors.data_sessao ? "border-red-500" : ""}
            required
          />
          {errors.data_sessao && <p className="text-sm text-red-600 dark:text-red-400">{errors.data_sessao}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duracao" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Duração (minutos) *
          </Label>
          <Select value={formData.duracao} onValueChange={(value) => handleInputChange("duracao", value)}>
            <SelectTrigger className={errors.duracao ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecione a duração" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutos</SelectItem>
              <SelectItem value="45">45 minutos</SelectItem>
              <SelectItem value="60">60 minutos</SelectItem>
              <SelectItem value="90">90 minutos</SelectItem>
              <SelectItem value="120">120 minutos</SelectItem>
            </SelectContent>
          </Select>
          {errors.duracao && <p className="text-sm text-red-600 dark:text-red-400">{errors.duracao}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status" className="flex items-center">
          <CheckCircle className="mr-2 h-4 w-4" />
          Status da Sessão
        </Label>
        <Select value={formData.status} onValueChange={(value: any) => handleInputChange("status", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="realizada">Realizada</SelectItem>
            <SelectItem value="agendada">Agendada</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="objetivos" className="flex items-center">
          <Target className="mr-2 h-4 w-4" />
          Objetivos da Sessão {formData.status === "realizada" && "*"}
        </Label>
        <Textarea
          id="objetivos"
          placeholder="Descreva os objetivos trabalhados nesta sessão..."
          value={formData.objetivos}
          onChange={(e) => handleInputChange("objetivos", e.target.value)}
          className={errors.objetivos ? "border-red-500" : ""}
          rows={3}
        />
        {errors.objetivos && <p className="text-sm text-red-600 dark:text-red-400">{errors.objetivos}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes" className="flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          Observações {formData.status === "realizada" && "*"}
        </Label>
        <Textarea
          id="observacoes"
          placeholder="Observações sobre o comportamento e participação do paciente..."
          value={formData.observacoes}
          onChange={(e) => handleInputChange("observacoes", e.target.value)}
          className={errors.observacoes ? "border-red-500" : ""}
          rows={3}
        />
        {errors.observacoes && <p className="text-sm text-red-600 dark:text-red-400">{errors.observacoes}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="resultados" className="flex items-center">
          <Target className="mr-2 h-4 w-4" />
          Resultados Obtidos
        </Label>
        <Textarea
          id="resultados"
          placeholder="Descreva os resultados e progressos observados..."
          value={formData.resultados}
          onChange={(e) => handleInputChange("resultados", e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              {editingSessao ? "Atualizando..." : "Salvando..."}
            </>
          ) : editingSessao ? (
            "Atualizar Sessão"
          ) : (
            "Salvar Sessão"
          )}
        </Button>
      </div>
    </form>
  )
}
