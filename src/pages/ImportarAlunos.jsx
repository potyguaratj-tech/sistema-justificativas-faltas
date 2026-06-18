import React, { useState, useEffect } from 'react'
import { Download, CheckCircle, AlertCircle } from 'lucide-react'

export default function ImportarAlunos({ alunos, salvarAlunos }) {
  const [carregando, setCarregando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [alunosCarregados, setAlunosCarregados] = useState([])

  const SHEET_ID = '1yd5t_sXw9308VrqHfycy9XLet-bETIXzoZ2Z425hg1I'
  const GID = '431280749' // ID da aba

  // URL para exportar como CSV direto do Google Sheets
  const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`

  const carregarDoGoogleSheets = async () => {
    setCarregando(true)
    setMensagem('')
    
    try {
      // Usar CORS proxy para evitar bloqueios
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
      const response = await fetch(proxyUrl + CSV_URL)
      
      if (!response.ok) {
        // Tentar sem proxy
        const response2 = await fetch(CSV_URL)
        if (!response2.ok) throw new Error('Erro ao conectar')
        
        const texto = await response2.text()
        processarCSV(texto)
      } else {
        const texto = await response.text()
        processarCSV(texto)
      }
    } catch (error) {
      setMensagem('❌ Erro ao conectar ao Google Sheets. Tente fazer download manual do arquivo.')
      setCarregando(false)
    }
  }

  const processarCSV = (csvText) => {
    try {
      const linhas = csvText.trim().split('\n')
      const headers = linhas[0].split(',')
      
      // Encontrar índices das colunas
      const nomeIndex = headers.findIndex(h => h.toLowerCase().includes('nome'))
      const turnoIndex = headers.findIndex(h => h.toLowerCase().includes('turno'))
      const turmaIndex = headers.findIndex(h => h.toLowerCase().includes('turma'))

      if (nomeIndex === -1) {
        setMensagem('❌ Coluna "Nome" não encontrada na planilha')
        setCarregando(false)
        return
      }

      const novosAlunos = []
      for (let i = 1; i < linhas.length; i++) {
        if (linhas[i].trim() === '') continue
        
        const colunas = linhas[i].split(',')
        const nome = colunas[nomeIndex]?.trim() || ''
        const turno = colunas[turnoIndex]?.trim() || '-'
        const turma = colunas[turmaIndex]?.trim() || '-'

        if (nome) {
          novosAlunos.push({
            id: alunos.length + novosAlunos.length + 1,
            alunoId: alunos.length + novosAlunos.length + 1,
            nome,
            turno,
            turma,
          })
        }
      }

      if (novosAlunos.length === 0) {
        setMensagem('❌ Nenhum aluno encontrado na planilha')
      } else {
        const todosAlunos = [...alunos, ...novosAlunos]
        salvarAlunos(todosAlunos)
        setAlunosCarregados(novosAlunos)
        setMensagem(`✅ ${novosAlunos.length} alunos importados com sucesso!`)
      }
    } catch (error) {
      setMensagem('❌ Erro ao processar dados da planilha')
    }
    setCarregando(false)
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Importar Alunos</h1>
        <p className="text-gray-600 mt-2">Carregue dados do Google Sheets ou de um arquivo Excel</p>
      </div>

      {/* Card de Carregamento do Google Sheets */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Opção 1: Google Sheets</h2>
        <p className="text-gray-600 mb-6">Clique para carregar os dados direto do Google Sheets</p>
        
        <button
          onClick={carregarDoGoogleSheets}
          disabled={carregando}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg w-full flex items-center justify-center space-x-2"
        >
          <Download size={20} />
          <span>{carregando ? 'Carregando...' : 'Carregar do Google Sheets'}</span>
        </button>
      </div>

      {/* Card de Upload Manual */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Opção 2: Upload Manual</h2>
        <p className="text-gray-600 mb-6">Ou faça upload de um arquivo Excel baixado</p>
        
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => {
              const file = e.target.files[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = (event) => {
                  try {
                    const texto = event.target.result
                    processarCSV(texto)
                  } catch (error) {
                    setMensagem('Erro ao processar arquivo')
                  }
                }
                reader.readAsText(file)
              }
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      {/* Mensagem */}
      {mensagem && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          mensagem.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {mensagem.includes('✅') ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <p>{mensagem}</p>
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