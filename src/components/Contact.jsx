import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react'
import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
    setFormData({ name: '', email: '', message: '' })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'suporte@axionstore.com',
      description: 'Resposta em até 2 horas'
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: '+55 11 99999-9999',
      description: 'Suporte 24/7 VIP'
    },
    {
      icon: Phone,
      label: 'Telefone',
      value: '0800-123-4567',
      description: 'Segunda a Sexta, 9h-18h'
    },
    {
      icon: Clock,
      label: 'Tempo Resposta',
      value: '< 1 hora',
      description: 'Média de atendimento'
    }
  ]

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full">
            <span className="text-purple-400 text-sm font-semibold">📞 CONTATO</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Entre em Contato</h2>
          <p className="text-gray-400 text-lg">Estamos aqui para ajudar você a decolar</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Envie sua mensagem</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Mensagem</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors resize-none"
                  placeholder="Como podemos ajudar você?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Enviar Mensagem
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Informações de Contato</h3>
            
            <div className="grid gap-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                return (
                  <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon size={24} className="text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">{info.label}</h4>
                        <p className="text-green-400 font-medium mb-1">{info.value}</p>
                        <p className="text-gray-400 text-sm">{info.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Support Hours */}
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-white mb-4">Horário de Suporte</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Segunda - Sexta</span>
                  <span className="text-green-400 font-medium">24/7 VIP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Sábado</span>
                  <span className="text-green-400 font-medium">9h - 18h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Domingo</span>
                  <span className="text-yellow-400 font-medium">Emergências</span>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="text-center">
              <p className="text-gray-400 mb-4">Dúvidas frequentes?</p>
              <button className="px-6 py-2 border-2 border-gray-700 rounded-xl font-semibold text-white hover:border-white transition-all">
                Ver FAQ →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
