// Formata o valor digitado para moeda brasileira
export function formatCurrency(value) {

  // Remove tudo que não for número
  const numericValue = value.replace(/\D/g, '')

  // Converte para centavos
  const amount = Number(numericValue) / 100

  // Formata para BRL
  return amount.toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
    }
  )
}