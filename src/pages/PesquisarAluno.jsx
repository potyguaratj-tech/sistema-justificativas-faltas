import React, { useState } from 'react'
import { Search, AlertCircle } from 'lucide-react'
import { calcularFrequencia, obterFaltasAluno } from '../utils/frequencia'

export default function PesquisarAluno({ alunos, faltas }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth())
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear())
  const [resultados, setResultados] = useState([])

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const handleSearch = () => {
    const filtrados = alunos.filter(aluno =>
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setResultados(filtrados)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Pesquisar Aluno</h1>
        <p className="text-gray-600 mt-2">Busque um aluno para ver seu histórico de faltas e frequência</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex gap-4 flex-wrap">
          {/* Busca */}
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Aluno</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite o nome"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Mês */}
          <div className="min-w-40">
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
          <div className="min-w-40">
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

      {/* Resultados */}
      {resultados.length > 0 && (
        <div className="space-y-4">
          {resultados.map(aluno => {
            const faltasAluno = obterFaltasAluno(faltas, aluno.alunoId, mesSelecionado, anoSelecionado)
            const totalFaltas = faltasAluno.length
            const frequencia = calcularFrequencia(totalFaltas)

            return (
              <div key={aluno.id} className="bg-white rounded-lg shadow p-6">
                {/* Info Aluno */}
                <div className="flex justify-between items-start mb-6 pb-6 border-b">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{aluno.nome}</h3>
                    <p className="text-gray-600 mt-1">Turma: {aluno.turma} | Turno: {aluno.turno}</p>
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
            )
          })}
        </div>
      )}

      {searchTerm && resultados.length === 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 flex items-center space-x-2">
          <AlertCircle size={20} />
          <p>Nenhum aluno encontrado com esse nome</p>
        </div>
      )}
    </div>
  )
}