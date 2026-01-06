import ServiceCard from './ServiceCard'
import { CreditCard, Database, Code2, Bot, Cpu, Server, Shield, Wallet } from 'lucide-react'

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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  }
]

export default function Services() {
  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Nossos Serviços</h2>
          <p className="text-gray-400 text-lg">Tudo que você precisa para dominar o universo digital</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
