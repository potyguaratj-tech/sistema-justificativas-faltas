import React, { useState, useMemo } from 'react'
import { AlertCircle } from 'lucide-react'
import { calcularFrequencia, obterFaltasAluno } from '../utils/frequencia'

export default function PesquisarAluno({ alunos, faltas }) {
  const [turno, setTurno] = useState('')
  const [turma, setTurma] = useState('')
  const [alunoSelecionado, setAlunoSelecionado] = useState('')
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth())
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear())

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  // Extrair turnos únicos
  const turnos = useMemo(() => {
    return [...new Set(alunos.map(aluno => aluno.turno))].filter(Boolean).sort()
  }, [alunos])

  // Extrair turmas filtradas pelo turno selecionado
  const turmasDisponiveis = useMemo(() => {
    if (!turno) return []
    return [...new Set(
      alunos
        .filter(aluno => aluno.turno === turno)
        .map(aluno => aluno.turma)
    )].sort()
  }, [alunos, turno])

  // Extrair alunos filtrados pelo turno e turma selecionados
  const alunosDisponiveis = useMemo(() => {
    if (!turno || !turma) return []
    return alunos
      .filter(aluno => aluno.turno === turno && aluno.turma === turma)
      .sort((a, b) => a.nome.localeCompare(b.nome))
  }, [alunos, turno, turma])

  // Encontrar o aluno selecionado
  const aluno = alunos.find(a => a.alunoId === parseInt(alunoSelecionado))

  const handleTurnoChange = (e) => {
    setTurno(e.target.value)
    setTurma('')
    setAlunoSelecionado('')
  }

  const handleTurmaChange = (e) => {
    setTurma(e.target.value)
    setAlunoSelecionado('')
  }

  const handleAlunoChange = (e) => {
    setAlunoSelecionado(e.target.value)
  }

  if (!aluno) {
    return (
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Pesquisar Aluno</h1>
          <p className="text-gray-600 mt-2">Selecione um aluno para ver seu histórico de faltas e frequência</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          {/* Turno */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Turno</label>
            <select
              value={turno}
              onChange={handleTurnoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um turno</option>
              {turnos.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Turma */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Turma {!turno && <span className="text-gray-500 text-xs">(selecione um turno primeiro)</span>}
            </label>
            <select
              value={turma}
              onChange={handleTurmaChange}
              disabled={!turno}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Selecione uma turma</option>
              {turmasDisponiveis.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Aluno */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Aluno {!turma && <span className="text-gray-500 text-xs">(selecione uma turma primeiro)</span>}
            </label>
            <select
              value={alunoSelecionado}
              onChange={handleAlunoChange}
              disabled={!turma}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Selecione um aluno</option>
              {alunosDisponiveis.map(a => (
                <option key={a.id} value={a.alunoId}>
                  {a.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Filtros de Período */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            {/* Mês */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mês</label>
              <select
                value={mesSelecionado}
                onChange={(e) => setMesSelecionado(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {meses.map((mes, index) => (
                  <option key={index} value={index}>
                    {mes}
                  </option>
                ))}
              </select>
            </div>

            {/* Ano */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ano</label>
              <select
                value={anoSelecionado}
                onChange={(e) => setAnoSelecionado(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[2024, 2025, 2026].map(ano => (
                  <option key={ano} value={ano}>
                    {ano}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mensagem Inicial */}
        <div className="bg-blue-50 p-6 rounded-lg text-blue-800 flex items-center space-x-3">
          <AlertCircle size={24} />
          <p>Selecione um turno, turma e aluno para visualizar seu histórico de faltas</p>
        </div>
      </div>
    )
  }

  // Dados do aluno selecionado
  const faltasAluno = obterFaltasAluno(faltas, aluno.alunoId, mesSelecionado, anoSelecionado)
  const totalFaltas = faltasAluno.length
  const frequencia = calcularFrequencia(totalFaltas)

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Pesquisar Aluno</h1>
        <p className="text-gray-600 mt-2">Selecione um aluno para ver seu histórico de faltas e frequência</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        {/* Turno */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Turno</label>
          <select
            value={turno}
            onChange={handleTurnoChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione um turno</option>
            {turnos.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Turma */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Turma {!turno && <span className="text-gray-500 text-xs">(selecione um turno primeiro)</span>}
          </label>
          <select
            value={turma}
            onChange={handleTurmaChange}
            disabled={!turno}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Selecione uma turma</option>
            {turmasDisponiveis.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Aluno */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Aluno {!turma && <span className="text-gray-500 text-xs">(selecione uma turma primeiro)</span>}
          </label>
          <select
            value={alunoSelecionado}
            onChange={handleAlunoChange}
            disabled={!turma}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Selecione um aluno</option>
            {alunosDisponiveis.map(a => (
              <option key={a.id} value={a.alunoId}>
                {a.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Filtros de Período */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          {/* Mês */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mês</label>
            <select
              value={mesSelecionado}
              onChange={(e) => setMesSelecionado(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {meses.map((mes, index) => (
                <option key={index} value={index}>
                  {mes}
                </option>
              ))}
            </select>
          </div>

          {/* Ano */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ano</label>
            <select
              value={anoSelecionado}
              onChange={(e) => setAnoSelecionado(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[2024, 2025, 2026].map(ano => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Card do Aluno */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Info Aluno */}
        <div className="flex justify-between items-start mb-6 pb-6 border-b">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{aluno.nome}</h3>
            <p className="text-gray-600 mt-1">Matrícula: {aluno.alunoId} | Turma: {aluno.turma} | Turno: {aluno.turno}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-blue-600">{frequencia.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">Frequência</p>
          </div>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded text-center">
            <p className="text-2xl font-bold text-red-600">{totalFaltas}</p>
            <p className="text-sm text-gray-600">Faltas</p>
          </div>
          <div className="bg-green-50 p-4 rounded text-center">
            <p className="text-2xl font-bold text-green-600">{frequencia.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">Frequência</p>
          </div>
          <div className="bg-blue-50 p-4 rounded text-center">
            <p className="text-2xl font-bold text-blue-600">{meses[mesSelecionado]} {anoSelecionado}</p>
            <p className="text-sm text-gray-600">Período</p>
          </div>
        </div>

        {/* Histórico de Faltas */}
        {totalFaltas > 0 ? (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Histórico de Faltas</h4>
            <div className="space-y-2">
              {faltasAluno.map((falta, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">{new Date(falta.dataDaFalta).toLocaleDateString('pt-BR')}</span>
                    <span className={`text-xs px-2 py-1 rounded ${falta.documento === 'sim' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {falta.documento === 'sim' ? 'Com Documento' : 'Sem Documento'}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">Motivo: {falta.motivo || 'Não especificado'}</p>
                  <p className="text-gray-600 text-xs mt-1">Justificado por: {falta.quemJustificou}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-green-50 p-4 rounded flex items-center space-x-2 text-green-800">
            <AlertCircle size={20} />
            <p>Nenhuma falta registrada neste período</p>
          </div>
        )}
      </div>
    </div>
  )
}
