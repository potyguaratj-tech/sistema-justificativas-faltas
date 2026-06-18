import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Home, Upload, Plus, Search, FileText } from 'lucide-react'

export default function Sidebar() {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-blue-900 text-white transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-blue-800 flex items-center justify-between">
        {isOpen && <h1 className="text-lg font-bold">Justificativas</h1>}
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-blue-800 rounded">
          <Menu size={20} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/" className="flex items-center space-x-3 p-3 rounded hover:bg-blue-800 transition">
          <Home size={20} />
          {isOpen && <span>Dashboard</span>}
        </Link>

        <Link to="/importar-alunos" className="flex items-center space-x-3 p-3 rounded hover:bg-blue-800 transition">
          <Upload size={20} />
          {isOpen && <span>Importar Alunos</span>}
        </Link>

        <Link to="/registrar-falta" className="flex items-center space-x-3 p-3 rounded hover:bg-blue-800 transition">
          <Plus size={20} />
          {isOpen && <span>Registrar Falta</span>}
        </Link>

        <Link to="/pesquisar-aluno" className="flex items-center space-x-3 p-3 rounded hover:bg-blue-800 transition">
          <Search size={20} />
          {isOpen && <span>Pesquisar Aluno</span>}
        </Link>

        <Link to="/relatorios" className="flex items-center space-x-3 p-3 rounded hover:bg-blue-800 transition">
          <FileText size={20} />
          {isOpen && <span>Relatórios</span>}
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-800 text-xs text-blue-300">
        {isOpen && <p>v1.0.0</p>}
      </div>
    </aside>
  )
}