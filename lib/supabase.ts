import { createClient } from "@supabase/supabase-js"

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is required")
}

if (!supabaseAnonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados (corrigidos conforme schema real)
export interface Usuario {
  id: string
  email: string
  nome: string
  especialidade?: string
  criado_em: string
  atualizado_em: string
}

export interface Paciente {
  id: string
  nome: string
  data_nascimento: string
  responsavel: string
  telefone?: string
  email?: string
  diagnostico?: string
  status: "ativo" | "inativo" | "alta"
  usuario_id: string
  criado_em: string
  atualizado_em: string
}

export interface Sessao {
  id: string
  paciente_id: string
  data_sessao: string
  duracao: number
  observacoes?: string
  objetivos?: string
  resultados?: string
  status: "realizada" | "cancelada" | "agendada"
  criado_em: string
  atualizado_em: string
}

export interface MarcoDesenvolvimento {
  id: string
  paciente_id: string
  categoria: string
  titulo: string
  descricao?: string
  data_alcancado?: string
  status: "pendente" | "alcancado" | "em_progresso"
  criado_em: string
  atualizado_em: string
}

export interface PlanoTratamento {
  id: string
  paciente_id: string
  titulo: string
  descricao?: string
  data_inicio: string
  data_fim?: string
  status: "ativo" | "concluido" | "pausado"
  criado_em: string
  atualizado_em: string
}

export interface MetricaProgresso {
  id: string
  paciente_id: string
  categoria: string
  valor: number
  data_registro: string
  observacao?: string
  criado_em: string
  atualizado_em: string
}

// Funções de teste de conexão
export async function testConnection() {
  try {
    // Verificar se o cliente Supabase foi inicializado corretamente
    if (!supabase) {
      return { success: false, error: "Cliente Supabase não inicializado" }
    }

    // Corrigido: usar .count() em vez de .select("count(*)")
    const { count, error } = await supabase.from("pacientes").select("*", { count: "exact", head: true })

    if (error) {
      console.error("Erro na conexão:", error)
      return { success: false, error: error.message }
    }

    return {
      success: true,
      message: "Conexão com Supabase estabelecida com sucesso!",
      count,
    }
  } catch (error) {
    console.error("Erro na conexão:", error)
    return { success: false, error: "Erro ao conectar com o banco de dados" }
  }
}

// Funções para Pacientes
export async function getPacientes(usuarioId: string) {
  try {
    if (!supabase) {
      return { data: null, error: { message: "Cliente Supabase não inicializado" } }
    }

    const { data, error } = await supabase
      .from("pacientes")
      .select("*")
      .eq("usuario_id", usuarioId)
      .order("criado_em", { ascending: false })

    if (error) {
      console.error("Erro ao buscar pacientes:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error)
    return { data: null, error: { message: "Erro inesperado ao buscar pacientes" } }
  }
}

export async function getPacienteById(id: string) {
  try {
    if (!supabase) {
      return { data: null, error: { message: "Cliente Supabase não inicializado" } }
    }

    const { data, error } = await supabase.from("pacientes").select("*").eq("id", id).single()

    if (error) {
      console.error("Erro ao buscar paciente:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao buscar paciente:", error)
    return { data: null, error: { message: "Erro inesperado ao buscar paciente" } }
  }
}

export async function createPaciente(paciente: Omit<Paciente, "id" | "criado_em" | "atualizado_em">) {
  try {
    if (!supabase) {
      return { data: null, error: { message: "Cliente Supabase não inicializado" } }
    }

    const { data, error } = await supabase.from("pacientes").insert([paciente]).select().single()

    if (error) {
      console.error("Erro ao criar paciente:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao criar paciente:", error)
    return { data: null, error: { message: "Erro inesperado ao criar paciente" } }
  }
}

export async function updatePaciente(id: string, updates: Partial<Paciente>) {
  try {
    if (!supabase) {
      return { data: null, error: { message: "Cliente Supabase não inicializado" } }
    }

    const { data, error } = await supabase
      .from("pacientes")
      .update({ ...updates, atualizado_em: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar paciente:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error)
    return { data: null, error: { message: "Erro inesperado ao atualizar paciente" } }
  }
}

// Funções para Sessões
export async function getSessoesByPaciente(pacienteId: string) {
  try {
    if (!supabase) {
      return { data: null, error: { message: "Cliente Supabase não inicializado" } }
    }

    const { data, error } = await supabase
      .from("sessoes")
      .select("*")
      .eq("paciente_id", pacienteId)
      .order("data_sessao", { ascending: false })

    if (error) {
      console.error("Erro ao buscar sessões:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao buscar sessões:", error)
    return { data: null, error: { message: "Erro inesperado ao buscar sessões" } }
  }
}

export async function createSessao(sessao: Omit<Sessao, "id" | "criado_em" | "atualizado_em">) {
  try {
    if (!supabase) {
      return { data: null, error: { message: "Cliente Supabase não inicializado" } }
    }

    const { data, error } = await supabase.from("sessoes").insert([sessao]).select().single()

    if (error) {
      console.error("Erro ao criar sessão:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao criar sessão:", error)
    return { data: null, error: { message: "Erro inesperado ao criar sessão" } }
  }
}

export async function updateSessao(id: string, updates: Partial<Sessao>) {
  try {
    if (!supabase) {
      return { data: null, error: { message: "Cliente Supabase não inicializado" } }
    }

    const { data, error } = await supabase
      .from("sessoes")
      .update({ ...updates, atualizado_em: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar sessão:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao atualizar sessão:", error)
    return { data: null, error: { message: "Erro inesperado ao atualizar sessão" } }
  }
}

export async function deleteSessao(id: string) {
  try {
    if (!supabase) {
      return { error: { message: "Cliente Supabase não inicializado" } }
    }

    const { error } = await supabase.from("sessoes").delete().eq("id", id)

    if (error) {
      console.error("Erro ao deletar sessão:", error)
      return { error }
    }

    return { error: null }
  } catch (error) {
    console.error("Erro ao deletar sessão:", error)
    return { error: { message: "Erro inesperado ao deletar sessão" } }
  }
}

// Funções para Marcos de Desenvolvimento
export async function getMarcosByPaciente(pacienteId: string) {
  try {
    if (!supabase) {
      return { data: null, error: { message: "Cliente Supabase não inicializado" } }
    }

    const { data, error } = await supabase
      .from("marcos_desenvolvimento")
      .select("*")
      .eq("paciente_id", pacienteId)
      .order("criado_em", { ascending: false })

    if (error) {
      console.error("Erro ao buscar marcos:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao buscar marcos:", error)
    return { data: null, error: { message: "Erro inesperado ao buscar marcos" } }
  }
}

export async function createMarco(marco: Omit<MarcoDesenvolvimento, "id" | "criado_em" | "atualizado_em">) {
  try {
    if (!supabase) {
      return { data: null, error: { message: "Cliente Supabase não inicializado" } }
    }

    const { data, error } = await supabase.from("marcos_desenvolvimento").insert([marco]).select().single()

    if (error) {
      console.error("Erro ao criar marco:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao criar marco:", error)
    return { data: null, error: { message: "Erro inesperado ao criar marco" } }
  }
}

// Funções para Planos de Tratamento
export async function getPlanosByPaciente(pacienteId: string) {
  try {
    if (!supabase) {
      return { data: null, error: { message: "Cliente Supabase não inicializado" } }
    }

    const { data, error } = await supabase
      .from("planos_tratamento")
      .select("*")
      .eq("paciente_id", pacienteId)
      .order("criado_em", { ascending: false })

    if (error) {
      console.error("Erro ao buscar planos:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao buscar planos:", error)
    return { data: null, error: { message: "Erro inesperado ao buscar planos" } }
  }
}

export async function createPlano(plano: Omit<PlanoTratamento, "id" | "criado_em" | "atualizado_em">) {
  try {
    if (!supabase) {
      return { data: null, error: { message: "Cliente Supabase não inicializado" } }
    }

    const { data, error } = await supabase.from("planos_tratamento").insert([plano]).select().single()

    if (error) {
      console.error("Erro ao criar plano:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao criar plano:", error)
    return { data: null, error: { message: "Erro inesperado ao criar plano" } }
  }
}

// Funções para Métricas de Progresso
export async function getMetricasByPaciente(pacienteId: string) {
  try {
    if (!supabase) {
      return { data: null, error: { message: "Cliente Supabase não inicializado" } }
    }

    const { data, error } = await supabase
      .from("metricas_progresso")
      .select("*")
      .eq("paciente_id", pacienteId)
      .order("data_registro", { ascending: false })

    if (error) {
      console.error("Erro ao buscar métricas:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao buscar métricas:", error)
    return { data: null, error: { message: "Erro inesperado ao buscar métricas" } }
  }
}

export async function createMetrica(metrica: Omit<MetricaProgresso, "id" | "criado_em" | "atualizado_em">) {
  try {
    if (!supabase) {
      return { data: null, error: { message: "Cliente Supabase não inicializado" } }
    }

    const { data, error } = await supabase.from("metricas_progresso").insert([metrica]).select().single()

    if (error) {
      console.error("Erro ao criar métrica:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao criar métrica:", error)
    return { data: null, error: { message: "Erro inesperado ao criar métrica" } }
  }
}

// Funções de estatísticas
export async function getDashboardStats(usuarioId: string) {
  try {
    if (!supabase) {
      return {
        pacientes: 0,
        sessoes: 0,
        marcos: 0,
        marcosAlcancados: 0,
      }
    }

    // Buscar pacientes
    const { data: pacientes } = await getPacientes(usuarioId)

    // Se não houver pacientes, retornar zeros
    if (!pacientes || pacientes.length === 0) {
      return {
        pacientes: 0,
        sessoes: 0,
        marcos: 0,
        marcosAlcancados: 0,
      }
    }

    // Extrair IDs dos pacientes para usar nas consultas
    const pacienteIds = pacientes.map((p) => p.id)

    // Buscar sessões dos pacientes
    const { data: sessoes, error: sessoesError } = await supabase
      .from("sessoes")
      .select("*")
      .in("paciente_id", pacienteIds)

    if (sessoesError) {
      console.error("Erro ao buscar sessões:", sessoesError)
    }

    // Buscar marcos dos pacientes
    const { data: marcos, error: marcosError } = await supabase
      .from("marcos_desenvolvimento")
      .select("*")
      .in("paciente_id", pacienteIds)

    if (marcosError) {
      console.error("Erro ao buscar marcos:", marcosError)
    }

    return {
      pacientes: pacientes?.length || 0,
      sessoes: sessoes?.length || 0,
      marcos: marcos?.length || 0,
      marcosAlcancados: marcos?.filter((m) => m.status === "alcancado").length || 0,
    }
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    return {
      pacientes: 0,
      sessoes: 0,
      marcos: 0,
      marcosAlcancados: 0,
    }
  }
}
