import { Check, ArrowLeft, Home, Download } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const location = useLocation()
  const { paymentData, product } = location.state || {}

  // Se não houver dados, redireciona para dashboard
  if (!paymentData || !product) {
    navigate('/dashboard')
    return null
  }

  const handleDownloadReceipt = () => {
    // Criar recibo em PDF (simulação)
    const receiptContent = `
RECIBO DE PAGAMENTO - AXION STORE
==================================

ID da Transação: ${paymentData.id}
Data: ${new Date(paymentData.createdAt).toLocaleString('pt-BR')}

DADOS DO CLIENTE:
Nome: ${paymentData.customer.name}
Email: ${paymentData.customer.email}
Telefone: ${paymentData.customer.phone_number}

PRODUTO:
${product.name}
${product.description}
Valor: R$ ${product.price.toFixed(2)}

MÉTODO DE PAGAMENTO: ${paymentData.method.toUpperCase()}
STATUS: ${paymentData.status === 'pending' ? 'Pendente' : 'Aprovado'}

METADATA:
Order ID: ${paymentData.metadata.orderId}
Source: ${paymentData.metadata.source}
Integration: ${paymentData.metadata.integration}

---
Axion Store - Pagamentos Seguros
    `

    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recibo-${paymentData.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-400" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-white mb-4">Pagamento Processado!</h1>
          <p className="text-gray-400 text-lg mb-8">
            Seu pagamento foi gerado com sucesso. Aguardamos a confirmação para liberar seu acesso.
          </p>

          {/* Product Info */}
          <div className="bg-gray-800/50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-white mb-4">Detalhes da Compra</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Produto:</span>
                <span className="text-white font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Valor:</span>
                <span className="text-green-400 font-semibold">R$ {product.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Método:</span>
                <span className="text-white capitalize">{paymentData.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`font-semibold ${
                  paymentData.status === 'pending' ? 'text-yellow-400' : 
                  paymentData.status === 'approved' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {paymentData.status === 'pending' ? 'Pendente de Confirmação' : 
                   paymentData.status === 'approved' ? 'Aprovado' : 'Erro'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ID Transação:</span>
                <span className="text-white text-xs font-mono">{paymentData.id}</span>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          {paymentData.method === 'pix' && paymentData.status === 'pending' && (
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-4 mb-8">
              <h3 className="text-blue-400 font-semibold mb-2">Próximos Passos - PIX</h3>
              <p className="text-gray-300 text-sm">
                1. Abra o aplicativo do seu banco<br />
                2. Escaneie o QR Code ou copie o código<br />
                3. Confirme o pagamento<br />
                4. Aguarde a confirmação (geralmente instantânea)
              </p>
            </div>
          )}

          {paymentData.method === 'card' && paymentData.status === 'pending' && (
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-4 mb-8">
              <h3 className="text-blue-400 font-semibold mb-2">Próximos Passos - Cartão</h3>
              <p className="text-gray-300 text-sm">
                1. Clique no link de pagamento fornecido<br />
                2. Preencha os dados do cartão<br />
                3. Confirme a transação<br />
                4. Aguarde a aprovação (geralmente instantânea)
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDownloadReceipt}
              className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Baixar Comprovante
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Ir para Dashboard
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-sm mb-2">
              Precisa de ajuda? Entre em contato com nosso suporte:
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <span className="text-blue-400">suporte@axionstore.com</span>
              <span className="text-green-400">WhatsApp: (11) 99999-9999</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
