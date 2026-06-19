import React, { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'

export default function RegistrarFalta({ alunos, faltas, salvarFaltas }) {
  const [formData, setFormData] = useState({
    turno: '',
    turma: '',
    alunoId: '',
    dataDaFalta: '',
    dataJustificativa: '',
    motivo: '',
    quemJustificou: 'responsavel',
    documento: 'nao',
  })

  const [mensagem, setMensagem] = useState('')

  // Extrair turnos únicos
  const turnos = useMemo(() => {
    return [...new Set(alunos.map(aluno => aluno.turno))].filter(Boolean).sort()
  }, [alunos])

  // Extrair turmas filtradas pelo turno selecionado
  const turmasDisponiveis = useMemo(() => {
    if (!formData.turno) return []
    return [...new Set(
      alunos
        .filter(aluno => aluno.turno === formData.turno)
        .map(aluno => aluno.turma)
    )].sort()
  }, [alunos, formData.turno])

  // Extrair alunos filtrados pelo turno e turma selecionados
  const alunosDisponiveis = useMemo(() => {
    if (!formData.turno || !formData.turma) return []
    return alunos
      .filter(aluno => aluno.turno === formData.turno && aluno.turma === formData.turma)
      .sort((a, b) => a.nome.localeCompare(b.nome))
  }, [alunos, formData.turno, formData.turma])

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Resetar campos dependentes quando turno muda
    if (name === 'turno') {
      setFormData(prev => ({ 
        ...prev, 
        turno: value,
        turma: '',
        alunoId: ''
      }))
    }
    // Resetar aluno quando turma muda
    else if (name === 'turma') {
      setFormData(prev => ({ 
        ...prev, 
        turma: value,
        alunoId: ''
      }))
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.alunoId || !formData.dataDaFalta || !formData.dataJustificativa) {
      setMensagem('Preencha todos os campos obrigatórios')
      return
    }

    const novaFalta = {
      id: faltas.length + 1,
      ...formData,
      alunoId: parseInt(formData.alunoId),
      dataCriacao: new Date().toISOString(),
    }

    salvarFaltas([...faltas, novaFalta])
    setMensagem('✓ Falta registrada com sucesso!')
    setFormData({
      turno: '',
      turma: '',
      alunoId: '',
      dataDaFalta: '',
      dataJustificativa: '',
      motivo: '',
      quemJustificou: 'responsavel',
      documento: 'nao',
    })
    setTimeout(() => setMensagem(''), 3000)
  }

  // Encontrar o aluno selecionado para mostrar mais informações
  const alunoSelecionado = alunos.find(a => a.alunoId === parseInt(formData.alunoId))

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Registrar Falta</h1>
        <p className="text-gray-600 mt-2">Adicione uma nova justificativa de falta</p>
      </div>

      <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Turno */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Turno *</label>
            <select
              name="turno"
              value={formData.turno}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um turno</option>
              {turnos.map(turno => (
                <option key={turno} value={turno}>
                  {turno}
                </option>
              ))}
            </select>
          </div>

          {/* Turma */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Turma * {!formData.turno && <span className="text-gray-500 text-xs">(selecione um turno primeiro)</span>}
            </label>
            <select
              name="turma"
              value={formData.turma}
              onChange={handleChange}
              disabled={!formData.turno}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Selecione uma turma</option>
              {turmasDisponiveis.map(turma => (
                <option key={turma} value={turma}>
                  {turma}
                </option>
              ))}
            </select>
          </div>

          {/* Aluno */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Aluno * {!formData.turma && <span className="text-gray-500 text-xs">(selecione uma turma primeiro)</span>}
            </label>
            <select
              name="alunoId"
              value={formData.alunoId}
              onChange={handleChange}
              disabled={!formData.turma}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Selecione um aluno</option>
              {alunosDisponiveis.map(aluno => (
                <option key={aluno.id} value={aluno.alunoId}>
                  {aluno.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Informações do Aluno Selecionado */}
          {alunoSelecionado && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700"><span className="font-semibold">Turno:</span> {alunoSelecionado.turno}</p>
              <p className="text-sm text-gray-700"><span className="font-semibold">Turma:</span> {alunoSelecionado.turma}</p>
              <p className="text-sm text-gray-700"><span className="font-semibold">Matrícula:</span> {alunoSelecionado.alunoId}</p>
            </div>
          )}

          {/* Data da Falta */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Data da Falta *</label>
            <input
              type="date"
              name="dataDaFalta"
              value={formData.dataDaFalta}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Data Justificativa */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Data da Justificativa *</label>
            <input
              type="date"
              name="dataJustificativa"
              value={formData.dataJustificativa}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Motivo da Falta</label>
            <input
              type="text"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              placeholder="Ex: Consultório odontológico"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quem Justificou */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quem Justificou</label>
            <select
              name="quemJustificou"
              value={formData.quemJustificou}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="responsavel">Responsável</option>
              <option value="aluno">Próprio Aluno</option>
              <option value="outro">Outra Pessoa</option>
            </select>
          </div>

          {/* Documento */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Apresentou Documento?</label>
            <select
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2"
          >
            <Plus size={20} />
            <span>Registrar Falta</span>
          </button>
        </form>
      </div>

      {/* Mensagem */}
      {mensagem && (
        <div className={`p-4 rounded-lg ${mensagem.includes('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {mensagem}
        </div>
      )}
    </div>
  )
}
