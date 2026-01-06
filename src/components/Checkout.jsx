import { useState } from 'react'
import { CreditCard, Smartphone, MapPin, User, Mail, Phone, FileText, Check, X, AlertCircle, QrCode, Copy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { createPayment, formatCurrency, generateOrderId } from '../services/axionPay'
import { generateQRCode, copyToClipboard } from '../utils/qrCode'
import dashboardService from '../services/dashboardService'

export default function Checkout({ product, onClose, onSuccess }) {
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [paymentData, setPaymentData] = useState(null)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [copied, setCopied] = useState(false)
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerCpf: '',
    billingStreet: '',
    billingNumber: '',
    billingComplement: '',
    billingNeighborhood: '',
    billingCity: '',
    billingState: '',
    billingZipcode: '',
    sameAsBilling: true,
    shippingStreet: '',
    shippingNumber: '',
    shippingComplement: '',
    shippingNeighborhood: '',
    shippingCity: '',
    shippingState: '',
    shippingZipcode: ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCopyPix = async (text) => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const generateQRCodeImage = async (pixCode) => {
    try {
      const url = await generateQRCode(pixCode)
      setQrCodeUrl(url)
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
    }
  }

  const validateForm = () => {
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.customerCpf) {
      setError('Preencha todos os campos obrigatórios')
      return false
    }
    
    if (!formData.billingStreet || !formData.billingNumber || !formData.billingCity || !formData.billingState || !formData.billingZipcode) {
      setError('Preencha o endereço de cobrança')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const orderId = generateOrderId()
      const items = [{
        id: product.id,
        title: product.name,
        quantity: 1,
        unit_price: product.price,
        tangible: false
      }]
      
      const response = await createPayment({
        ...formData,
        method: paymentMethod,
        amount: product.price,
        orderId,
        items
      })
      
      setPaymentData(response)
      
      // Salvar transação no LocalDB
      const userData = JSON.parse(localStorage.getItem('user'))
      if (userData) {
        await dashboardService.createTransaction(userData.id, {
          amount: product.price,
          method: paymentMethod,
          status: response.status,
          description: product.name,
          orderId: orderId,
          items: items,
          metadata: {
            paymentId: response.id,
            provider: response.provider,
            customer: response.customer
          }
        })
      }
      
      // Se for PIX, gera o QR Code
      if (paymentMethod === 'pix' && response.metadata?.pix?.qrcode) {
        await generateQRCodeImage(response.metadata.pix.qrcode)
      }
      
      setStep(3)
      
    } catch (err) {
      setError(err.message || 'Erro ao processar pagamento')
    } finally {
      setLoading(false)
    }
  }

  if (step === 3 && paymentData) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Pagamento Gerado!</h2>
            <p className="text-gray-400 mb-6">
              {paymentMethod === 'pix' ? 'Use o QR Code abaixo para pagar' : 'Redirecionando para pagamento...'}
            </p>
            
            {paymentMethod === 'pix' && paymentData.metadata?.pix && (
              <div className="bg-gray-800 rounded-xl p-4 mb-6">
                <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR Code PIX" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <QrCode size={60} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Gerando QR Code...</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">QR Code PIX:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-green-400 break-all bg-gray-700 p-2 rounded flex-1">
                        {paymentData.metadata.pix.qrcode}
                      </code>
                      <button
                        onClick={() => handleCopyPix(paymentData.metadata.pix.qrcode)}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        title="Copiar QR Code"
                      >
                        <Copy size={16} className={copied ? "text-green-400" : "text-gray-400"} />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Copia e Cola:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-blue-400 break-all bg-gray-700 p-2 rounded flex-1">
                        {paymentData.metadata.pix.copia_colar}
                      </code>
                      <button
                        onClick={() => handleCopyPix(paymentData.metadata.pix.copia_colar)}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        title="Copiar Copia e Cola"
                      >
                        <Copy size={16} className={copied ? "text-green-400" : "text-gray-400"} />
                      </button>
                    </div>
                  </div>
                  
                  {copied && (
                    <p className="text-xs text-green-400 text-center">✓ Copiado para área de transferência!</p>
                  )}
                </div>
              </div>
            )}
            
            {paymentMethod === 'card' && paymentData.metadata?.providerRaw?.url && (
              <div className="bg-gray-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-400 mb-3">Clique no link abaixo para pagar:</p>
                <a 
                  href={paymentData.metadata.providerRaw.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline break-all"
                >
                  {paymentData.metadata.providerRaw.url}
                </a>
              </div>
            )}
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Produto:</span>
                <span className="text-white">{product.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Valor:</span>
                <span className="text-green-400 font-semibold">{formatCurrency(product.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Transação ID:</span>
                <span className="text-white text-xs">{paymentData.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status:</span>
                <span className={`font-semibold ${
                  paymentData.status === 'pending' ? 'text-yellow-400' : 
                  paymentData.status === 'approved' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {paymentData.status === 'pending' ? 'Pendente' : 
                   paymentData.status === 'approved' ? 'Aprovado' : 'Erro'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onSuccess?.(paymentData)
                  // Redirecionar para página de sucesso com os dados do pagamento
                  navigate('/payment-success', { 
                    state: { 
                      paymentData, 
                      product 
                    } 
                  })
                }}
                className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
              >
                Confirmar
              </button>
              
              <button
                onClick={onClose}
                className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Checkout</h2>
              <p className="text-gray-400">Complete sua compra de forma segura</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Product Summary */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center`}>
              <product.icon size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{product.name}</h3>
              <p className="text-gray-400 text-sm">{product.description}</p>
              <div className="text-2xl font-bold text-green-400 mt-1">
                {formatCurrency(product.price)}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Método de Pagamento</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPaymentMethod('pix')}
              className={`p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'pix'
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <QrCode size={24} className={`mx-auto mb-2 ${paymentMethod === 'pix' ? 'text-green-400' : 'text-gray-400'}`} />
              <div className={`font-semibold ${paymentMethod === 'pix' ? 'text-green-400' : 'text-white'}`}>PIX</div>
              <div className="text-sm text-gray-400">Pagamento instantâneo</div>
            </button>
            
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <CreditCard size={24} className={`mx-auto mb-2 ${paymentMethod === 'card' ? 'text-blue-400' : 'text-gray-400'}`} />
              <div className={`font-semibold ${paymentMethod === 'card' ? 'text-blue-400' : 'text-white'}`}>Cartão</div>
              <div className="text-sm text-gray-400">Crédito/Débito</div>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Customer Data */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Dados do Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Nome Completo *</label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    placeholder="João da Silva"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Email *</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    placeholder="joao@email.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Telefone *</label>
                <div className="relative">
                  <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    placeholder="+55 11 99999-9999"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 text-sm">CPF *</label>
                <div className="relative">
                  <FileText size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.customerCpf}
                    onChange={(e) => handleInputChange('customerCpf', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    placeholder="123.456.789-09"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Endereço de Cobrança</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 text-sm">Rua *</label>
                <div className="relative">
                  <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.billingStreet}
                    onChange={(e) => handleInputChange('billingStreet', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    placeholder="Rua Exemplo"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Número *</label>
                <input
                  type="text"
                  value={formData.billingNumber}
                  onChange={(e) => handleInputChange('billingNumber', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                  placeholder="123"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Complemento</label>
                <input
                  type="text"
                  value={formData.billingComplement}
                  onChange={(e) => handleInputChange('billingComplement', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                  placeholder="Apto 45"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Bairro *</label>
                <input
                  type="text"
                  value={formData.billingNeighborhood}
                  onChange={(e) => handleInputChange('billingNeighborhood', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                  placeholder="Centro"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Cidade *</label>
                <input
                  type="text"
                  value={formData.billingCity}
                  onChange={(e) => handleInputChange('billingCity', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                  placeholder="São Paulo"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Estado *</label>
                <input
                  type="text"
                  value={formData.billingState}
                  onChange={(e) => handleInputChange('billingState', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                  placeholder="SP"
                  maxLength={2}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 text-sm">CEP *</label>
                <input
                  type="text"
                  value={formData.billingZipcode}
                  onChange={(e) => handleInputChange('billingZipcode', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                  placeholder="01001-000"
                  required
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processando...</span>
                </div>
              ) : (
                `Pagar ${formatCurrency(product.price)}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
