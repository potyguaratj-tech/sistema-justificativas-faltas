import React from 'react'
import { Users, AlertCircle, TrendingDown } from 'lucide-react'

export default function Dashboard({ alunos, faltas }) {
  const totalAlunos = alunos.length
  const totalFaltas = faltas.length
  const alunosComFaltas = new Set(faltas.map(f => f.alunoId)).size

  const mesAtual = new Date().getMonth()
  const anoAtual = new Date().getFullYear()

  const faltasEssMes = faltas.filter(f => {
    const data = new Date(f.dataDaFalta)
    return data.getMonth() === mesAtual && data.getFullYear() === anoAtual
  }).length

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bem-vindo ao Sistema de Justificativas de Faltas</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Total de Alunos */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total de Alunos</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{totalAlunos}</p>
            </div>
            <Users size={32} className="text-blue-500 opacity-20" />
          </div>
        </div>

        {/* Card Total de Faltas */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total de Faltas</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{totalFaltas}</p>
            </div>
            <AlertCircle size={32} className="text-red-500 opacity-20" />
          </div>
        </div>

        {/* Card Alunos com Faltas */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Alunos com Faltas</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{alunosComFaltas}</p>
            </div>
            <TrendingDown size={32} className="text-yellow-500 opacity-20" />
          </div>
        </div>

        {/* Card Faltas Este Mês */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Faltas Este Mês</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{faltasEssMes}</p>
            </div>
            <AlertCircle size={32} className="text-green-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Informações Gerais */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Informações do Sistema</h2>
        <div className="space-y-3 text-gray-600">
          <p>✓ Sistema de gerenciamento de justificativas de faltas de alunos</p>
          <p>✓ Importe dados de alunos via planilha Excel</p>
          <p>✓ Registre faltas e justificativas</p>
          <p>✓ Acompanhe frequência em tempo real (cada falta = -4,5%)</p>
          <p>✓ Pesquise alunos e veja histórico de faltas</p>
          <p>✓ Gere relatórios detalhados</p>
        </div>
      </div>
    </div>
  )
}