import React, { useState } from 'react'
import { Plus } from 'lucide-react'

export default function RegistrarFalta({ alunos, faltas, salvarFaltas }) {
  const [formData, setFormData] = useState({
    alunoId: '',
    dataDaFalta: '',
    dataJustificativa: '',
    motivo: '',
    quemJustificou: 'responsavel',
    documento: 'nao',
  })

  const [mensagem, setMensagem] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
      alunoId: '',
      dataDaFalta: '',
      dataJustificativa: '',
      motivo: '',
      quemJustificou: 'responsavel',
      documento: 'nao',
    })
    setTimeout(() => setMensagem(''), 3000)
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Registrar Falta</h1>
        <p className="text-gray-600 mt-2">Adicione uma nova justificativa de falta</p>
      </div>

      <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Aluno */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Aluno *</label>
            <select
              name="alunoId"
              value={formData.alunoId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um aluno</option>
              {alunos.map(aluno => (
                <option key={aluno.id} value={aluno.alunoId}>
                  {aluno.nome} - {aluno.turma}
                </option>
              ))}
            </select>
          </div>

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