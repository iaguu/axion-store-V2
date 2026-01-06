import { CreditCard, Bot, Crown, Search, Database, Cpu, Shield, Zap, Globe, Smartphone, Mail, Phone } from 'lucide-react'

export const products = {
  cards: [
    {
      id: 'card-basic',
      name: 'Card Basic',
      category: 'cards',
      price: 50.00,
      description: 'Card virtual para testes e desenvolvimento',
      features: ['Limite R$ 500', 'Validade 30 dias', 'Aprovação imediata', 'Suporte básico'],
      icon: CreditCard,
      color: 'from-green-500 to-green-600',
      popular: false,
      stock: 150,
      type: 'virtual'
    },
    {
      id: 'card-pro',
      name: 'Card Pro',
      category: 'cards',
      price: 150.00,
      description: 'Card com limite elevado para operações profissionais',
      features: ['Limite R$ 5.000', 'Validade 90 dias', 'Aprovação garantida', 'Suporte prioritário', 'Cashback 2%'],
      icon: CreditCard,
      color: 'from-blue-500 to-blue-600',
      popular: true,
      stock: 75,
      type: 'virtual'
    },
    {
      id: 'card-vip',
      name: 'Card VIP Black',
      category: 'cards',
      price: 500.00,
      description: 'Card premium sem limites para operações de alto valor',
      features: ['Limite ilimitado', 'Validade 180 dias', 'Aprovação instantânea', 'Suporte 24/7', 'Cashback 5%', 'Seguro fraud'],
      icon: Crown,
      color: 'from-purple-500 to-purple-600',
      popular: false,
      stock: 25,
      type: 'premium'
    }
  ],
  
  bots: [
    {
      id: 'bot-whatsapp',
      name: 'Bot WhatsApp Pro',
      category: 'bots',
      price: 97.00,
      description: 'Automação completa para WhatsApp marketing',
      features: ['1000 contatos/dia', 'Mensagens personalizadas', 'Agendamento', 'Relatórios detalhados', 'API REST'],
      icon: Smartphone,
      color: 'from-green-500 to-green-600',
      popular: true,
      stock: 50,
      type: 'automation'
    },
    {
      id: 'bot-telegram',
      name: 'Bot Telegram Master',
      category: 'bots',
      price: 87.00,
      description: 'Bot para Telegram com recursos avançados',
      features: ['Grupos ilimitados', 'Comandos customizados', 'Integração com APIs', 'Anti-spam inteligente'],
      icon: Bot,
      color: 'from-blue-500 to-blue-600',
      popular: false,
      stock: 100,
      type: 'automation'
    },
    {
      id: 'bot-trading',
      name: 'Bot Trading AI',
      category: 'bots',
      price: 297.00,
      description: 'Bot de trading com inteligência artificial',
      features: ['Análise em tempo real', 'Múltiplas exchanges', 'Machine Learning', 'Backtesting', 'Alertas customizados'],
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      popular: false,
      stock: 30,
      type: 'premium'
    }
  ],

  consultas: [
    {
      id: 'consulta-cpf',
      name: 'Consulta CPF Completa',
      category: 'consultas',
      price: 5.00,
      description: 'Consulta detalhada de dados CPF',
      features: ['Dados básicos', 'Score de crédito', 'Histórico', 'Atualização em tempo real'],
      icon: Search,
      color: 'from-blue-500 to-blue-600',
      popular: true,
      stock: 999999,
      type: 'unitaria'
    },
    {
      id: 'consulta-telefone',
      name: 'Consulta Telefone',
      category: 'consultas',
      price: 3.00,
      description: 'Identificação de proprietário de telefone',
      features: ['Nome completo', 'Endereço', 'Operadora', 'Status da linha'],
      icon: Phone,
      color: 'from-green-500 to-green-600',
      popular: false,
      stock: 999999,
      type: 'unitaria'
    },
    {
      id: 'consulta-placa',
      name: 'Consulta Placa Veicular',
      category: 'consultas',
      price: 8.00,
      description: 'Informações completas do veículo',
      features: ['Dados do veículo', 'Multas', 'IPVA', 'Histórico', 'Fotos'],
      icon: Search,
      color: 'from-purple-500 to-purple-600',
      popular: false,
      stock: 999999,
      type: 'unitaria'
    },
    {
      id: 'pacote-consultas',
      name: 'Pacote 100 Consultas',
      category: 'consultas',
      price: 297.00,
      description: 'Pacote com 100 consultas variadas',
      features: ['100 consultas', 'Todos os tipos', 'Validade 90 dias', 'Relatórios consolidados'],
      icon: Database,
      color: 'from-orange-500 to-orange-600',
      popular: false,
      stock: 100,
      type: 'pacote'
    }
  ],

  vip: [
    {
      id: 'vip-consultas',
      name: 'VIP Consultas Ilimitadas',
      category: 'vip',
      price: 997.00,
      description: 'Acesso VIP a consultas ilimitadas por 30 dias',
      features: ['Consultas ilimitadas', 'Todos os bancos de dados', 'API dedicada', 'Suporte exclusivo', 'Atualização premium'],
      icon: Crown,
      color: 'from-yellow-500 to-yellow-600',
      popular: false,
      stock: 10,
      type: 'subscription'
    },
    {
      id: 'vip-cards',
      name: 'VIP Cards Marketplace',
      category: 'vip',
      price: 1497.00,
      description: 'Acesso exclusivo ao marketplace de cards premium',
      features: ['Cards exclusivos', 'Limites elevados', 'Verificação prioritária', 'Garantia especial', 'Cashback 10%'],
      icon: CreditCard,
      color: 'from-purple-500 to-purple-600',
      popular: false,
      stock: 5,
      type: 'subscription'
    },
    {
      id: 'vip-all-access',
      name: 'VIP All Access',
      category: 'vip',
      price: 2997.00,
      description: 'Acesso total a todos os serviços por 30 dias',
      features: ['Todos os serviços', 'Sem limites', 'API completa', 'Gerente de conta', 'Treinamento premium', 'Eventos exclusivos'],
      icon: Crown,
      color: 'from-red-500 to-red-600',
      popular: true,
      stock: 3,
      type: 'subscription'
    }
  ],

  tools: [
    {
      id: 'tool-proxy',
      name: 'Proxy Premium',
      category: 'tools',
      price: 47.00,
      description: 'Proxy residencial de alta qualidade',
      features: ['IP dedicado', 'Velocidade 1Gbps', 'Localização escolhida', 'Rotativo automático'],
      icon: Globe,
      color: 'from-cyan-500 to-cyan-600',
      popular: false,
      stock: 200,
      type: 'service'
    },
    {
      id: 'tool-vpn',
      name: 'VPN Military Grade',
      category: 'tools',
      price: 37.00,
      description: 'VPN com criptografia militar',
      features: ['Criptografia AES-256', '50+ países', 'No-log policy', 'Kill switch'],
      icon: Shield,
      color: 'from-green-500 to-green-600',
      popular: false,
      stock: 500,
      type: 'service'
    },
    {
      id: 'tool-email',
      name: 'Email Marketing Pro',
      category: 'tools',
      price: 67.00,
      description: 'Sistema completo de email marketing',
      features: ['10.000 emails/dia', 'Templates prontos', 'Análise de taxas', 'Autoresponder'],
      icon: Mail,
      color: 'from-blue-500 to-blue-600',
      popular: false,
      stock: 100,
      type: 'service'
    }
  ]
}

export const categories = [
  { id: 'cards', name: 'Cards', icon: CreditCard, color: 'from-green-500 to-green-600' },
  { id: 'bots', name: 'Bots & Automação', icon: Bot, color: 'from-purple-500 to-purple-600' },
  { id: 'consultas', name: 'Consultas', icon: Search, color: 'from-blue-500 to-blue-600' },
  { id: 'vip', name: 'VIP Premium', icon: Crown, color: 'from-yellow-500 to-yellow-600' },
  { id: 'tools', name: 'Ferramentas', icon: Cpu, color: 'from-orange-500 to-orange-600' }
]

export const getAllProducts = () => {
  return Object.values(products).flat()
}

export const getProductsByCategory = (categoryId) => {
  return products[categoryId] || []
}

export const getProductById = (productId) => {
  return getAllProducts().find(product => product.id === productId)
}

export const getFeaturedProducts = () => {
  return getAllProducts().filter(product => product.popular)
}
