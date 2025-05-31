"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulação de login - em produção, usar autenticação real
      if (email && senha) {
        // Simular delay de autenticação
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o dashboard...",
        })

        router.push("/dashboard")
      } else {
        throw new Error("Email e senha são obrigatórios")
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar na sua conta</CardTitle>
        <CardDescription>Digite suas credenciais para acessar o sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link href="/recuperar-senha" className="text-sm text-blue-600 hover:underline">
            Esqueceu sua senha?
          </Link>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Não tem uma conta?{" "}
            <Link href="/registro" className="text-blue-600 hover:underline font-medium">
              Criar conta
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
