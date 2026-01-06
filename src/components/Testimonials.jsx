import { Star, Quote, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const testimonials = [
  {
    id: 1,
    name: 'João Silva',
    role: 'Trader Digital',
    avatar: 'JS',
    rating: 5,
    content: 'A AXION STORE revolucionou minhas operações. Os cards live são incríveis e o suporte é impecável. Consegui aumentar meus lucros em 300% no primeiro mês.',
    result: '+300% Lucros',
    verified: true
  },
  {
    id: 2,
    name: 'Maria Santos',
    role: 'Desenvolvedora Black',
    avatar: 'MS',
    rating: 5,
    content: 'Ferramentas de desenvolvimento de primeira qualidade. A integração com blockchain é perfeita e a infraestrutura é ultra segura. Recomendo sem dúvidas.',
    result: '50+ Projetos',
    verified: true
  },
  {
    id: 3,
    name: 'Pedro Costa',
    role: 'Especialista em Automação',
    avatar: 'PC',
    rating: 5,
    content: 'Os bots de WhatsApp e Telegram são fenomenais. Consigo processar mais de 1000 operações por minuto sem problemas. Interface intuitiva e API robusta.',
    result: '1K+ Ops/Min',
    verified: true
  },
  {
    id: 4,
    name: 'Ana Oliveira',
    role: 'Analista de Dados',
    avatar: 'AO',
    rating: 5,
    content: 'O database search é completo e atualizado em tempo real. Economizo horas de trabalho todos os dias com as consultas automatizadas.',
    result: '-80% Tempo',
    verified: true
  },
  {
    id: 5,
    name: 'Lucas Ferreira',
    role: 'Empreendedor Digital',
    avatar: 'LF',
    rating: 5,
    content: 'Comecei com o plano free e já migrei para o VIP. O ROI é incrível e as ferramentas pagam si mesmas no primeiro mês.',
    result: 'ROI 10x',
    verified: true
  },
  {
    id: 6,
    name: 'Carla Dias',
    role: 'Consultora Tech',
    avatar: 'CD',
    rating: 5,
    content: 'As ferramentas de IA são as melhores que já usei. GPT-4 Turbo, Claude 3, Gemini Ultra... tudo em um só lugar com preços imbatíveis.',
    result: 'Premium IA',
    verified: true
  }
]

const socialProof = [
  { label: 'Usuários Satisfeitos', value: '98%', icon: '😊' },
  { label: 'Taxa Retenção', value: '95%', icon: '🔄' },
  { label: 'Suporte 24/7', value: '100%', icon: '⚡' },
  { label: 'Países Atendidos', value: '47', icon: '🌍' }
]

export default function Testimonials() {
  const navigate = useNavigate()

  const handleJoinNow = () => {
    navigate('/register')
  }

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
            <span className="text-yellow-400 text-sm font-semibold">⭐ PROVA SOCIAL</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">O Que Dizem Nossos Usuários</h2>
          <p className="text-gray-400 text-lg">Mais de 50.000 usuários confiam na AXION STORE</p>
        </div>

        {/* Social Proof Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {socialProof.map((stat, index) => (
            <div key={index} className="text-center bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all group">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <CheckCircle size={16} className="text-green-400" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <Quote size={20} className="text-gray-600 group-hover:text-gray-500 transition-colors" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-300 mb-4 leading-relaxed">{testimonial.content}</p>

              {/* Result Badge */}
              <div className="inline-block px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
                <span className="text-green-400 text-sm font-semibold">{testimonial.result}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-block p-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full">
            <button 
              onClick={handleJoinNow}
              className="bg-black px-8 py-3 rounded-full font-bold text-white hover:bg-gray-900 transition-colors"
            >
              Junte-se a 50K+ Usuários →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
