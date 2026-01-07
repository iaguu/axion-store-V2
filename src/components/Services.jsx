import ServiceCard from './ServiceCard'
import { CreditCard, Database, Code2, Bot, Cpu, Server, Shield, Wallet, Crown, Zap, Lock } from 'lucide-react'
import { useState } from 'react'

const services = [
  {
    id: 1,
    title: 'Cards Marketplace',
    description: 'Compra e venda com verificação live',
    icon: CreditCard,
    color: 'from-green-500 to-green-600',
    features: [
      '10K+ cards ativos',
      'Status live 24/7',
      'Limites até R$ 5.000'
    ],
    pricing: {
      basic: { price: 97, features: ['100 cards/mês', 'API básica', 'Suporte email'] },
      pro: { price: 297, features: ['1000 cards/mês', 'API completa', 'Suporte priority', 'Analytics'] },
      enterprise: { price: 997, features: ['Cards ilimitados', 'API dedicada', 'Suporte 24/7', 'White label'] }
    }
  },
  {
    id: 2,
    title: 'Database Search',
    description: 'Acesso instantâneo a dados privilegiados',
    icon: Database,
    color: 'from-blue-500 to-blue-600',
    features: [
      'CPF, NOME, TELEFONE',
      'PLACA, FOTO veicular',
      'Atualização em tempo real'
    ],
    pricing: {
      basic: { price: 147, features: ['100 consultas/mês', 'Dados básicos', 'API REST'] },
      pro: { price: 447, features: ['1000 consultas/mês', 'Dados completos', 'API + Webhook', 'Histórico'] },
      enterprise: { price: 1497, features: ['Consultas ilimitadas', 'Dados premium', 'API dedicada', 'SLA 99.9%'] }
    }
  },
  {
    id: 3,
    title: 'Black Development',
    description: 'Sites e aplicações para operações discretas',
    icon: Code2,
    color: 'from-pink-500 to-pink-600',
    features: [
      'Marketplaces anônimos',
      'Blockchain integrada',
      'Hospedagem segura'
    ],
    pricing: {
      basic: { price: 497, features: ['1 site básico', 'Hospedagem compartilhada', 'SSL básico'] },
      pro: { price: 1497, features: ['5 sites', 'Hospedagem dedicada', 'SSL avançado', 'CDN'] },
      enterprise: { price: 4997, features: ['Sites ilimitados', 'Infraestrutura completa', 'SSL enterprise', 'DDoS protection'] }
    }
  },
  {
    id: 4,
    title: 'Bots & Automação',
    description: 'WhatsApp, Telegram e trading automatizado',
    icon: Bot,
    color: 'from-orange-500 to-orange-600',
    features: [
      'WhatsApp & Telegram',
      '1000+ ops/minuto',
      'API robusta'
    ],
    pricing: {
      basic: { price: 197, features: ['1 bot básico', '1000 msgs/dia', 'API limitada'] },
      pro: { price: 597, features: ['5 bots', '10000 msgs/dia', 'API completa', 'Analytics'] },
      enterprise: { price: 1997, features: ['Bots ilimitados', 'Mensagens ilimitadas', 'API dedicada', 'Customização'] }
    }
  },
  {
    id: 5,
    title: 'IA Tools',
    description: 'Modelos SOTA com preços imbatíveis',
    icon: Cpu,
    color: 'from-purple-500 to-purple-600',
    features: [
      'GPT-4 Turbo',
      'Claude 3 Opus',
      'Gemini Ultra'
    ],
    pricing: {
      basic: { price: 97, features: ['100K tokens/mês', 'GPT-3.5', 'API básica'] },
      pro: { price: 297, features: ['1M tokens/mês', 'GPT-4 + Claude', 'API completa', 'Fine-tuning'] },
      enterprise: { price: 997, features: ['Tokens ilimitados', 'Todos os modelos', 'API dedicada', 'Modelos custom'] }
    }
  },
  {
    id: 6,
    title: 'Infraestrutura',
    description: 'VPS, Cloud, VPN e Proxy de alta performance',
    icon: Server,
    color: 'from-cyan-500 to-cyan-600',
    features: [
      'VPS dedicados',
      '99.99% uptime',
      'Military VPN'
    ],
    pricing: {
      basic: { price: 47, features: ['1 VPS básico', '2 cores, 4GB RAM', '100GB SSD'] },
      pro: { price: 147, features: ['3 VPS pro', '4 cores, 8GB RAM', '500GB SSD', 'VPN incluída'] },
      enterprise: { price: 497, features: ['VPS ilimitados', 'Custom specs', 'SSD ilimitado', 'VPN + Proxy'] }
    }
  },
  {
    id: 7,
    title: 'Segurança',
    description: 'Proteção enterprise para suas operações',
    icon: Shield,
    color: 'from-red-500 to-red-600',
    features: [
      'Criptografia end-to-end',
      'Auditoria 24/7',
      'Compliance garantido'
    ],
    pricing: {
      basic: { price: 97, features: ['Scan básico', 'Relatórios mensais', 'Suporte email'] },
      pro: { price: 297, features: ['Scan avançado', 'Relatórios semanais', 'Suporte priority', 'API'] },
      enterprise: { price: 997, features: ['Scan completo', 'Relatórios tempo real', 'Suporte 24/7', 'Consultoria'] }
    }
  },
  {
    id: 8,
    title: 'AxionPay',
    description: 'Gateway especializado em pagamentos digitais',
    icon: Wallet,
    color: 'from-yellow-500 to-yellow-600',
    features: [
      'Aprovação < 1s',
      'Zero chargeback',
      'Taxas 0.5%'
    ],
    pricing: {
      basic: { price: 0, features: ['Taxa 2.9%', 'R$10.000/mês', 'API básica'] },
      pro: { price: 97, features: ['Taxa 1.9%', 'R$50.000/mês', 'API completa', 'Anti-fraude'] },
      enterprise: { price: 497, features: ['Taxa 0.5%', 'Volume ilimitado', 'API dedicada', 'Gestão risco'] }
    }
  }
]

export default function Services() {
  const [selectedService, setSelectedService] = useState(null)
  const [showUpsell, setShowUpsell] = useState(false)

  const handleServiceClick = (service) => {
    setSelectedService(service)
    setShowUpsell(true)
  }

  const handlePlanSelect = (service, plan) => {
    window.location.href = `/checkout?service=${service?.id || 'all'}&plan=${plan}`
  }

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Nossos Serviços</h2>
          <p className="text-gray-400 text-lg mb-8">Tudo que você precisa para dominar o universo digital</p>
          
          {/* Banner de Upsell */}
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-6 mb-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Crown className="w-8 h-8 text-white" />
              <h3 className="text-2xl font-bold text-white">OFERTA IMPERDÍVEL</h3>
              <Crown className="w-8 h-8 text-white" />
            </div>
            <p className="text-white text-lg mb-4">
              Pacote Premium completo com TODOS os serviços por apenas <span className="text-3xl font-bold">R$ 997/mês</span>
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-4">
              <div className="flex items-center gap-2 text-white">
                <Zap className="w-5 h-5" />
                <span>Economia de R$ 3.000+</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Lock className="w-5 h-5" />
                <span>Acesso Vitalício</span>
              </div>
            </div>
            <button 
              onClick={() => handlePlanSelect(null, 'premium')}
              className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              QUERO O PACOTE COMPLETO
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div 
              key={service.id}
              onClick={() => handleServiceClick(service)}
              className="cursor-pointer transform hover:scale-105 transition-transform"
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        {/* Modal de Upsell */}
        {showUpsell && selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-white">
                  Escolha seu plano {selectedService.title}
                </h3>
                <button 
                  onClick={() => setShowUpsell(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(selectedService.pricing).map(([plan, details]) => (
                  <div 
                    key={plan}
                    className={`bg-gray-800 rounded-lg p-6 border-2 ${
                      plan === 'pro' ? 'border-yellow-500' : 'border-gray-700'
                    }`}
                  >
                    {plan === 'pro' && (
                      <div className="bg-yellow-500 text-black text-center py-1 rounded-t-lg -mt-6 -mx-6 mb-4 font-bold">
                        MAIS POPULAR
                      </div>
                    )}
                    
                    <h4 className="text-xl font-bold text-white mb-2 capitalize">
                      {plan === 'basic' ? 'Básico' : plan === 'pro' ? 'Profissional' : 'Enterprise'}
                    </h4>
                    
                    <div className="text-3xl font-bold text-white mb-4">
                      {details.price === 0 ? 'Grátis' : `R$ ${details.price}/mês`}
                    </div>
                    
                    <ul className="space-y-2 mb-6">
                      {details.features.map((feature, idx) => (
                        <li key={idx} className="text-gray-300 flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button 
                      onClick={() => handlePlanSelect(selectedService, plan)}
                      className={`w-full py-3 rounded-lg font-bold transition-colors ${
                        plan === 'pro' 
                          ? 'bg-yellow-500 text-black hover:bg-yellow-400' 
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {plan === 'basic' ? 'Começar' : plan === 'pro' ? 'Assinar Agora' : 'Contatar Vendas'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Upsell adicional */}
              <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6">
                <h4 className="text-xl font-bold text-white mb-3">
                  🚀 UPGRADE EXCLUSIVO
                </h4>
                <p className="text-white mb-4">
                  Adicione o plano {selectedService.title} ao PACOTE COMPLETO e ganhe 2 meses grátis!
                </p>
                <button 
                  onClick={() => handlePlanSelect(selectedService, 'premium-upgrade')}
                  className="bg-white text-purple-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                >
                  ADICIONAR AO PACOTE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
