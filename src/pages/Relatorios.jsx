import React, { useState } from 'react'
import { FileText, Download } from 'lucide-react'
import { calcularFrequencia, contarFaltasNoMes } from '../utils/frequencia'

export default function Relatorios({ alunos, faltas }) {
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth())
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear())

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const alunosComDados = alunos.map(aluno => {
    const totalFaltas = contarFaltasNoMes(faltas, aluno.alunoId, mesSelecionado, anoSelecionado)
    return {
      ...aluno,
      totalFaltas,
      frequencia: calcularFrequencia(totalFaltas),
    }
  }).sort((a, b) => a.turma.localeCompare(b.turma))

  const exportarParaCSV = () => {
    const headers = ['Nome', 'Turma', 'Turno', 'Faltas', 'Frequência (%)']
    const rows = alunosComDados.map(aluno => [
      aluno.nome,
      aluno.turma,
      aluno.turno,
      aluno.totalFaltas,
      aluno.frequencia.toFixed(1),
    ])

    let csv = headers.join(',')
    rows.forEach(row => {
      csv += '\n' + row.join(',')
    })

    const link = document.createElement('a')
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    link.download = `relatorio_faltas_${meses[mesSelecionado]}_${anoSelecionado}.csv`
    link.click()
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Relatórios</h1>
        <p className="text-gray-600 mt-2">Visualize relatórios de frequência dos alunos</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6 flex gap-4 items-end flex-wrap">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mês</label>
          <select
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {meses.map((mes, index) => (
              <option key={index} value={index}>
                {mes}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ano</label>
          <select
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[2024, 2025, 2026].map(ano => (
              <option key={ano} value={ano}>
                {ano}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={exportarParaCSV}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2"
        >
          <Download size={18} />
          <span>Exportar CSV</span>
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">Nome</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">Turma</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">Turno</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700">Faltas</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700">Frequência</th>
            </tr>
          </thead>
          <tbody>
            {alunosComDados.map((aluno) => (
              <tr key={aluno.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4">{aluno.nome}</td>
                <td className="px-6 py-4">{aluno.turma}</td>
                <td className="px-6 py-4">{aluno.turno}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-bold ${aluno.totalFaltas === 0 ? 'bg-green-600' : 'bg-red-600'}`}>
                    {aluno.totalFaltas}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-bold ${
                    aluno.frequencia >= 75 ? 'bg-green-600' :
                    aluno.frequencia >= 50 ? 'bg-yellow-600' :
                    'bg-red-600'
                  }`}>
                    {aluno.frequencia.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Total de Alunos</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{alunosComDados.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Alunos com Faltas</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{alunosComDados.filter(a => a.totalFaltas > 0).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Frequência Média</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{(alunosComDados.reduce((sum, a) => sum + a.frequencia, 0) / alunosComDados.length).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  )
}