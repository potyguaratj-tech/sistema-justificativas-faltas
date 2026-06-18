// Utilitários para cálculo de frequência

export function calcularFrequencia(faltasNoMes) {
  // Cada falta subtrai 4.5% da frequência
  const frequenciaBase = 100
  const frequencia = frequenciaBase - (faltasNoMes * 4.5)
  return Math.max(0, frequencia) // Não pode ser negativa
}

export function contarFaltasNoMes(faltas, alunoId, mes, ano) {
  return faltas.filter(falta => {
    const dataFalta = new Date(falta.dataDaFalta)
    return (
      falta.alunoId === alunoId &&
      dataFalta.getMonth() === mes &&
      dataFalta.getFullYear() === ano
    )
  }).length
}

export function obterFaltasAluno(faltas, alunoId, mes, ano) {
  return faltas.filter(falta => {
    const dataFalta = new Date(falta.dataDaFalta)
    return (
      falta.alunoId === alunoId &&
      dataFalta.getMonth() === mes &&
      dataFalta.getFullYear() === ano
    )
  })
}