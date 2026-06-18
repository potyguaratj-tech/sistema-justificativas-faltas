import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ImportarAlunos from './pages/ImportarAlunos'
import RegistrarFalta from './pages/RegistrarFalta'
import PesquisarAluno from './pages/PesquisarAluno'
import Relatorios from './pages/Relatorios'

function App() {
  const [alunos, setAlunos] = useState([])
  const [faltas, setFaltas] = useState([])

  // Carregar dados do localStorage
  useEffect(() => {
    const alunosArmazenados = localStorage.getItem('alunos')
    const faltasArmazenadas = localStorage.getItem('faltas')
    
    if (alunosArmazenados) {
      setAlunos(JSON.parse(alunosArmazenados))
    }
    if (faltasArmazenadas) {
      setFaltas(JSON.parse(faltasArmazenadas))
    }
  }, [])

  // Salvar alunos no localStorage
  const salvarAlunos = (novosAlunos) => {
    setAlunos(novosAlunos)
    localStorage.setItem('alunos', JSON.stringify(novosAlunos))
  }

  // Salvar faltas no localStorage
  const salvarFaltas = (novasFaltas) => {
    setFaltas(novasFaltas)
    localStorage.setItem('faltas', JSON.stringify(novasFaltas))
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard alunos={alunos} faltas={faltas} />} />
            <Route path="/importar-alunos" element={<ImportarAlunos alunos={alunos} salvarAlunos={salvarAlunos} />} />
            <Route path="/registrar-falta" element={<RegistrarFalta alunos={alunos} faltas={faltas} salvarFaltas={salvarFaltas} />} />
            <Route path="/pesquisar-aluno" element={<PesquisarAluno alunos={alunos} faltas={faltas} />} />
            <Route path="/relatorios" element={<Relatorios alunos={alunos} faltas={faltas} />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
