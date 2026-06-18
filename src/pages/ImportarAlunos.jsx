import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { Upload, CheckCircle } from 'lucide-react'

export default function ImportarAlunos({ alunos, salvarAlunos }) {
  const [arquivo, setArquivo] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const [alunosCarregados, setAlunosCarregados] = useState([])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setArquivo(file)
      setMensagem('')
    }
  }

  const handleUpload = () => {
    if (!arquivo) {
      setMensagem('Selecione um arquivo')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        // Mapear colunas: Nome, Turno, Turma
        const novosAlunos = jsonData.map((row, index) => ({
          id: alunos.length + index + 1,
          alunoId: alunos.length + index + 1,
          nome: row.Nome || row.nome || row.NOME || '',
          turno: row.Turno || row.turno || row.TURNO || '',
          turma: row.Turma || row.turma || row.TURMA || '',
        }))

        const todosAlunos = [...alunos, ...novosAlunos]
        salvarAlunos(todosAlunos)
        setAlunosCarregados(novosAlunos)
        setMensagem(`✓ ${novosAlunos.length} alunos importados com sucesso!`)
        setArquivo(null)
      } catch (error) {
        setMensagem('Erro ao processar arquivo. Verifique o formato.')
      }
    }
    reader.readAsArrayBuffer(arquivo)
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Importar Alunos</h1>
        <p className="text-gray-600 mt-2">Carregue uma planilha Excel com os alunos (Nome, Turno, Turma)</p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow p-8">
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
          <Upload size={48} className="mx-auto text-blue-500 mb-4" />
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-4 text-sm text-gray-600">ou arraste um arquivo aqui</p>
          {arquivo && <p className="mt-2 text-green-600 font-semibold">{arquivo.name}</p>}
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full"
      >
        Carregar Alunos
      </button>

      {/* Mensagem */}
      {mensagem && (
        <div className={`p-4 rounded-lg ${mensagem.includes('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {mensagem}
        </div>
      )}

      {/* Alunos Carregados */}
      {alunosCarregados.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <CheckCircle className="text-green-500 mr-2" />
            Alunos Carregados ({alunosCarregados.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b">
                <tr>
                  <th className="pb-2 font-semibold">Nome</th>
                  <th className="pb-2 font-semibold">Turno</th>
                  <th className="pb-2 font-semibold">Turma</th>
                </tr>
              </thead>
              <tbody>
                {alunosCarregados.map((aluno) => (
                  <tr key={aluno.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{aluno.nome}</td>
                    <td className="py-3">{aluno.turno}</td>
                    <td className="py-3">{aluno.turma}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}