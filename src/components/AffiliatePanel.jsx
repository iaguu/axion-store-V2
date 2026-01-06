import { useState, useEffect } from 'react'
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar, 
  Upload, 
  Link, 
  ExternalLink, 
  Gift, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Share2,
  Target,
  Award,
  Wallet,
  FileText,
  Send,
  History
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import affiliateService from '../services/affiliateService'

export default function AffiliatePanel() {
  const navigate = useNavigate()
  const [affiliateData, setAffiliateData] = useState(null)
  const [tasks, setTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])
  const [balance, setBalance] = useState(0)
  const [withdrawHistory, setWithdrawHistory] = useState([])
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [uploadScreen, setUploadScreen] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [referralCode, setReferralCode] = useState('')
  const [referralStats, setReferralStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Verificar se usuário está logado
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('user')
    
    if (!isLoggedIn || !userData) {
      navigate('/login')
      return
    }
    
    // Carregar dados do afiliado
    loadAffiliateData()
    loadReferralStats()
  }, [navigate])

  const loadAffiliateData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const userData = JSON.parse(localStorage.getItem('user'))
      if (!userData) {
        setError('Usuário não encontrado. Faça login novamente.')
        return
      }

      console.log('Carregando dados do afiliado para usuário:', userData.id)
      
      // Carregar perfil do afiliado
      const profile = await affiliateService.getAffiliateProfile(userData.id)
      console.log('Perfil do afiliado:', profile)
      
      if (!profile) {
        console.log('Perfil não encontrado, inicializando dados de exemplo...')
        // Criar perfil se não existir
        await affiliateService.initializeSampleData(userData.id)
        const newProfile = await affiliateService.getAffiliateProfile(userData.id)
        setAffiliateData(newProfile)
      } else {
        setAffiliateData(profile)
      }

      // Carregar estatísticas
      const stats = await affiliateService.getAffiliateStats(userData.id)
      console.log('Estatísticas do afiliado:', stats)
      setBalance(stats.availableBalance)
      setReferralCode(stats.referralCode)

      // Carregar tarefas
      const todayTasks = await affiliateService.getAffiliateTasks(userData.id)
      console.log('Tarefas do afiliado:', todayTasks)
      setTasks(todayTasks)

      // Carregar histórico de saques
      const transactions = await affiliateService.getAffiliateTransactions(userData.id)
      console.log('Transações do afiliado:', transactions)
      setWithdrawHistory(transactions.filter(tx => tx.type === 'withdraw'))

    } catch (error) {
      console.error('Erro ao carregar dados do afiliado:', error)
      setError('Não foi possível carregar seus dados de afiliado. Tente recarregar a página.')
      
      // Definir valores padrão
      setAffiliateData({
        id: 'default',
        name: 'Afiliado',
        email: 'email@example.com',
        level: 'Bronze',
        joinDate: new Date().toISOString(),
        totalEarned: 0,
        availableBalance: 0,
        pendingWithdraw: 0,
        referralCode: 'DEMO123',
        referralLink: 'https://axionstore.com/register?ref=DEMO123',
        totalReferrals: 0,
        activeReferrals: 0,
        commissionRate: 10
      })
      setBalance(0)
      setReferralCode('DEMO123')
      setTasks([])
      setWithdrawHistory([])
      
    } finally {
      setLoading(false)
    }
  }

  const loadReferralStats = async () => {
    const userData = JSON.parse(localStorage.getItem('user'))
    if (userData) {
      try {
        const stats = await affiliateService.getAffiliateStats(userData.id)
        setReferralStats({
          totalReferrals: stats.totalReferrals,
          activeReferrals: stats.activeReferrals,
          totalCommission: stats.totalCommission,
          monthlyCommission: stats.monthlyCommission,
          topReferrer: false,
          nextLevel: 'Prata',
          nextLevelRequirement: 2500
        })
      } catch (error) {
        console.error('Erro ao carregar estatísticas de indicação:', error)
      }
    }
  }

  const handleCompleteTask = async (taskId) => {
    const userData = JSON.parse(localStorage.getItem('user'))
    if (!userData) return

    try {
      await affiliateService.completeTask(taskId, userData.id)
      
      // Atualizar UI
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: 'completed' } : task
      ))
      setCompletedTasks([...completedTasks, taskId])
      
      // Adicionar recompensa ao saldo
      const task = tasks.find(t => t.id === taskId)
      setBalance(prev => prev + task.reward)
      
      alert(`Tarefa "${task.title}" concluída! R$ ${task.reward.toFixed(2)} creditados em sua conta.`)
    } catch (error) {
      console.error('Erro ao completar tarefa:', error)
      alert('Erro ao completar tarefa. Tente novamente.')
    }
  }

  const handleWithdraw = async () => {
    const userData = JSON.parse(localStorage.getItem('user'))
    if (!userData) return

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Digite um valor válido para saque')
      return
    }
    
    if (parseFloat(withdrawAmount) > balance) {
      alert('Saldo insuficiente para saque')
      return
    }
    
    if (parseFloat(withdrawAmount) < 20) {
      alert('Valor mínimo para saque é R$ 20,00')
      return
    }
    
    try {
      // Criar transação de saque
      await affiliateService.createAffiliateTransaction(userData.id, {
        amount: parseFloat(withdrawAmount),
        type: 'withdraw',
        method: 'pix',
        pixKey: affiliateData?.email || userData.email,
        status: 'pending'
      })
      
      // Atualizar saldo
      setBalance(prev => prev - parseFloat(withdrawAmount))
      
      // Adicionar ao histórico
      const newWithdraw = {
        id: Date.now(),
        amount: parseFloat(withdrawAmount),
        date: new Date().toISOString(),
        status: 'pending',
        method: 'pix',
        pixKey: affiliateData?.email || userData.email
      }
      setWithdrawHistory([newWithdraw, ...withdrawHistory])
      
      setShowWithdrawModal(false)
      setWithdrawAmount('')
      
      alert(`Solicitação de R$ ${parseFloat(withdrawAmount).toFixed(2)} enviada! Será processada até segunda-feira.`)
    } catch (error) {
      console.error('Erro ao solicitar saque:', error)
      alert('Erro ao solicitar saque. Tente novamente.')
    }
  }

  const handleImageUpload = async (e) => {
    const userData = JSON.parse(localStorage.getItem('user'))
    if (!userData) return

    const file = e.target.files[0]
    if (!file) return

    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        setUploadedImage(reader.result)
        
        // Calcular bônus aleatório entre R$ 1,00 e R$ 3,00
        const bonusAmount = Math.random() * 2 + 1
        
        // Adicionar bônus no banco de dados
        await affiliateService.addPrintBonus(userData.id, {
          amount: bonusAmount,
          type: 'print_bonus',
          description: `Bônus por print da tarefa`,
          fileName: file.name,
          fileSize: file.size
        })
        
        // Atualizar saldo
        setBalance(prev => prev + bonusAmount)
        
        setTimeout(() => {
          alert(`Print recebido! Bônus de R$ ${bonusAmount.toFixed(2)} creditado em sua conta.`)
          setUploadedImage(null)
        }, 2000)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Erro ao processar upload:', error)
      alert('Erro ao enviar print. Tente novamente.')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Link copiado para área de transferência!')
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
    alert('Código de afiliado copiado!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Carregando painel de afiliado...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-400 mb-2">Erro no Painel de Afiliados</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={loadAffiliateData}
            className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  if (!affiliateData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Carregando painel de afiliado...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-gray-800 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black border-2 border-white rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">&gt;</span>
                </div>
                <span className="text-lg font-bold">AXION<span className="font-light">AFFILIATE</span></span>
              </div>
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 text-sm">
                {affiliateData.level}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Voltar ao Dashboard
              </button>
              
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{affiliateData.name}</p>
                  <p className="text-xs text-gray-400">Afiliado {affiliateData.level}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{affiliateData.name.charAt(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Wallet className="text-green-400" size={24} />
              <span className="text-green-400 text-sm">+12%</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">R$ {balance.toFixed(2)}</div>
            <div className="text-gray-400 text-sm">Saldo Disponível</div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-blue-400" size={24} />
              <span className="text-blue-400 text-sm">+8%</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">R$ {affiliateData.totalEarned.toFixed(2)}</div>
            <div className="text-gray-400 text-sm">Total Ganho</div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="text-purple-400" size={24} />
              <span className="text-purple-400 text-sm">+3</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{affiliateData.totalReferrals}</div>
            <div className="text-gray-400 text-sm">Indicações</div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="text-yellow-400" size={24} />
              <span className="text-yellow-400 text-sm">{affiliateData.commissionRate}%</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{affiliateData.commissionRate}%</div>
            <div className="text-gray-400 text-sm">Comissão</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tarefas Diárias */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Target size={24} className="text-green-400" />
                  Tarefas Diárias
                </h2>
                <span className="text-sm text-gray-400">
                  {new Date().toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div className="space-y-4">
                {tasks.map(task => (
                  <div key={task.id} className={`border rounded-xl p-4 ${
                    task.status === 'completed' 
                      ? 'border-green-500/50 bg-green-500/10' 
                      : 'border-gray-700 bg-gray-800/50'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{task.title}</h3>
                        <p className="text-gray-400 text-sm">{task.description}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-green-400 font-bold">R$ {task.reward.toFixed(2)}</span>
                        {task.status === 'completed' ? (
                          <CheckCircle size={20} className="text-green-400" />
                        ) : (
                          <Clock size={20} className="text-yellow-400" />
                        )}
                      </div>
                    </div>

                    {task.link && (
                      <div className="mb-3">
                        <a
                          href={task.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                        >
                          <ExternalLink size={16} />
                          Acessar Link
                        </a>
                      </div>
                    )}

                    <div className="space-y-1 mb-3">
                      {task.instructions.map((instruction, index) => (
                        <p key={index} className="text-gray-400 text-xs flex items-start gap-2">
                          <span className="text-green-400">{instruction}</span>
                        </p>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {task.status !== 'completed' && (
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm"
                        >
                          Concluir Tarefa
                        </button>
                      )}
                      
                      {task.type === 'social' && (
                        <button
                          onClick={() => setUploadScreen(true)}
                          className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm"
                        >
                          Enviar Print
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload de Prints */}
            {uploadScreen && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Upload size={20} className="text-blue-400" />
                  Enviar Comprovante
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Selecione o print da tarefa</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
                    />
                  </div>

                  {uploadedImage && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">Preview:</p>
                      <img src={uploadedImage} alt="Preview" className="w-full rounded-lg" />
                      <p className="text-xs text-green-400 mt-2">✓ Processando... Bônus será creditado em breve.</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => setUploadScreen(false)}
                      className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Direita */}
          <div className="space-y-6">
            {/* Link de Afiliado */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Link size={20} className="text-purple-400" />
                Link de Afiliado
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Seu código:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={referralCode}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm"
                    />
                    <button
                      onClick={copyReferralCode}
                      className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                    >
                      <Copy size={16} className="text-white" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Link completo:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={affiliateData.referralLink}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs"
                    />
                    <button
                      onClick={() => copyToClipboard(affiliateData.referralLink)}
                      className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                    >
                      <Copy size={16} className="text-white" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(affiliateData.referralLink)}
                  className="w-full bg-purple-500 text-white py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 size={16} />
                  Compartilhar Link
                </button>
              </div>
            </div>

            {/* Estatísticas de Indicação */}
            {referralStats && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Users size={20} className="text-blue-400" />
                  Estatísticas
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Indicados:</span>
                    <span className="text-white font-semibold">{referralStats.totalReferrals}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Ativos:</span>
                    <span className="text-green-400 font-semibold">{referralStats.activeReferrals}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Comissão Total:</span>
                    <span className="text-blue-400 font-semibold">R$ {referralStats.totalCommission.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Comissão Mês:</span>
                    <span className="text-purple-400 font-semibold">R$ {referralStats.monthlyCommission.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Saque */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-green-400" />
                Solicitar Saque
              </h3>
              
              <div className="space-y-3">
                <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
                  <p className="text-xs text-yellow-400">
                    <strong>Atenção:</strong> Saques são processados toda segunda-feira. 
                    Valor mínimo: R$ 20,00
                  </p>
                </div>

                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Solicitar Saque
                </button>

                {withdrawHistory.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Histórico:</h4>
                    <div className="space-y-2">
                      {withdrawHistory.slice(0, 3).map(withdraw => (
                        <div key={withdraw.id} className="text-xs bg-gray-800 rounded-lg p-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">{new Date(withdraw.date).toLocaleDateString('pt-BR')}</span>
                            <span className={`font-semibold ${
                              withdraw.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                              R$ {withdraw.amount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Saque */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Solicitar Saque</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Saldo Disponível:</label>
                <div className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-green-400 font-semibold">
                  R$ {balance.toFixed(2)}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">Valor do Saque:</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="R$ 0,00"
                  min="20"
                  max={balance}
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
                <p className="text-xs text-yellow-400">
                  • Valor mínimo: R$ 20,00<br />
                  • Processado até segunda-feira<br />
                  • Taxa de transferência: R$ 2,50
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  Confirmar Saque
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
