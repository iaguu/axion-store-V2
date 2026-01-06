import { Trophy, Zap, Shield, Users, TrendingUp, Award } from 'lucide-react'

const stats = [
  { icon: Users, label: 'Usuários Ativos', value: '50K+', color: 'from-blue-500 to-blue-600' },
  { icon: Trophy, label: 'Cards Processados', value: '1.2M+', color: 'from-green-500 to-green-600' },
  { icon: Zap, label: 'Tempo Resposta', value: '< 1s', color: 'from-yellow-500 to-yellow-600' },
  { icon: Shield, label: 'Taxa Sucesso', value: '99.9%', color: 'from-purple-500 to-purple-600' },
]

const badges = [
  { name: 'SSL Secure', icon: Shield, color: 'bg-green-500' },
  { name: 'GDPR Compliant', icon: Award, color: 'bg-blue-500' },
  { name: '24/7 Support', icon: Users, color: 'bg-purple-500' },
  { name: 'Enterprise Ready', icon: TrendingUp, color: 'bg-orange-500' },
]

export default function Stats() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={32} className="text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Badges Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-white mb-8">Certificações e Segurança</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {badges.map((badge, index) => {
              const Icon = badge.icon
              return (
                <div key={index} className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-full hover:border-gray-700 transition-all">
                  <div className={`w-8 h-8 ${badge.color} rounded-full flex items-center justify-center`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <span className="text-white text-sm font-medium">{badge.name}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-2xl p-6 hover:border-green-500/50 transition-all">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
              <Zap size={24} className="text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Ultra Rápido</h4>
            <p className="text-gray-400">Processamento em tempo real com latência inferior a 1 segundo</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
              <Shield size={24} className="text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">100% Seguro</h4>
            <p className="text-gray-400">Criptografia militar e auditoria constante para máxima proteção</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp size={24} className="text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Escalável</h4>
            <p className="text-gray-400">Infraestrutura que cresce com suas necessidades sem limites</p>
          </div>
        </div>
      </div>
    </section>
  )
}
