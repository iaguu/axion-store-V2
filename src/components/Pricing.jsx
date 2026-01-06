import { Check, X, Star, Zap, Crown, Rocket } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const plans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfeito para começar',
    price: 'R$ 0',
    period: '/mês',
    icon: Rocket,
    color: 'from-gray-600 to-gray-700',
    borderColor: 'border-gray-600',
    buttonColor: 'bg-gray-600 hover:bg-gray-700',
    features: [
      { name: '10 Cards/mês', included: true },
      { name: 'Database básico', included: true },
      { name: 'Suporte comunitário', included: true },
      { name: 'API limitada', included: true },
      { name: 'Cards live', included: false },
      { name: 'Bots avançados', included: false },
      { name: 'IA premium', included: false },
      { name: 'VPS dedicado', included: false },
      { name: 'Prioridade no suporte', included: false },
      { name: 'Acesso white label', included: false },
    ],
    badge: null
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Para profissionais',
    price: 'R$ 97',
    period: '/mês',
    icon: Zap,
    color: 'from-blue-500 to-blue-600',
    borderColor: 'border-blue-500',
    buttonColor: 'bg-blue-500 hover:bg-blue-600',
    features: [
      { name: '500 Cards/mês', included: true },
      { name: 'Database completo', included: true },
      { name: 'Suporte prioritário', included: true },
      { name: 'API completa', included: true },
      { name: 'Cards live 24/7', included: true },
      { name: 'Bots básicos', included: true },
      { name: 'IA standard', included: true },
      { name: 'VPS compartilhado', included: true },
      { name: 'Prioridade no suporte', included: true },
      { name: 'Acesso white label', included: false },
    ],
    badge: 'Mais Popular'
  },
  {
    id: 'vip',
    name: 'VIP',
    description: 'Ilimitado e exclusivo',
    price: 'R$ 297',
    period: '/mês',
    icon: Crown,
    color: 'from-yellow-500 to-yellow-600',
    borderColor: 'border-yellow-500',
    buttonColor: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
    features: [
      { name: 'Cards ilimitados', included: true },
      { name: 'Database premium', included: true },
      { name: 'Suporte dedicado 24/7', included: true },
      { name: 'API ilimitada', included: true },
      { name: 'Cards live exclusivos', included: true },
      { name: 'Bots avançados', included: true },
      { name: 'IA premium completa', included: true },
      { name: 'VPS dedicado', included: true },
      { name: 'Gerente de conta', included: true },
      { name: 'Acesso white label', included: true },
    ],
    badge: 'MELHOR VALOR'
  }
]

export default function Pricing() {
  const navigate = useNavigate()

  const handlePlanSelect = (planId) => {
    // Redireciona para a página de registro com o plano selecionado
    navigate('/register', { state: { selectedPlan: planId } })
  }

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full">
            <span className="text-blue-400 text-sm font-semibold">💎 PLANOS</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Escolha Seu Plano</h2>
          <p className="text-gray-400 text-lg">Comece grátis e evolua conforme seu crescimento</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div key={plan.id} className={`relative bg-gray-900/50 border-2 ${plan.borderColor} rounded-3xl p-8 hover:border-gray-600 transition-all group ${plan.id === 'vip' ? 'scale-105 shadow-2xl shadow-yellow-500/20' : ''}`}>
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="px-4 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full">
                      <span className="text-black text-xs font-bold">{plan.badge}</span>
                    </div>
                  </div>
                )}

                {/* Plan Icon */}
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={32} className="text-white" />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white text-center mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-center mb-6">{plan.description}</p>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-white">{plan.price}</div>
                  <div className="text-gray-400">{plan.period}</div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check size={18} className="text-green-400 flex-shrink-0" />
                      ) : (
                        <X size={18} className="text-gray-600 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-600'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button 
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`w-full py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${plan.buttonColor} ${plan.id === 'vip' ? 'shadow-lg hover:shadow-yellow-500/25' : ''}`}
                >
                  {plan.id === 'free' ? 'Começar Grátis' : `Assinar ${plan.name}`}
                </button>
              </div>
            )
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full">
            <Star size={16} className="text-yellow-400" />
            <span className="text-gray-300 text-sm">Cancelamento a qualquer momento • Sem taxas escondidas • 7 dias garantia</span>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">Precisa de uma solução personalizada?</p>
          <button className="px-8 py-3 border-2 border-gray-700 rounded-xl font-semibold text-white hover:border-white transition-all">
            Falar com Vendas →
          </button>
        </div>
      </div>
    </section>
  )
}
