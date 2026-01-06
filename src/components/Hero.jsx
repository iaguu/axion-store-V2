import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleGetStarted = () => {
    navigate('/register')
  }

  const handleSeePlans = () => {
    scrollToSection('pricing')
  }

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-block mb-6 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full">
          <span className="text-green-400 text-sm font-semibold">● CARDS LIVE V2.0</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          O Universo<br />
          Digital<br />
          em um Só Lugar
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
          <span className="text-green-400 font-semibold">Compre e venda cards</span> com verificação live instantânea, 
          <span className="text-blue-400 font-semibold"> acesse dados exclusivos</span> de CPF, NOME, TELEFONE, PLACA, 
          <span className="text-purple-400 font-semibold"> desenvolva sites black</span> com blockchain, 
          <span className="text-orange-400 font-semibold"> automatize bots</span> no WhatsApp e Telegram, 
          <span className="text-blue-300 font-semibold"> use IA avançada</span> com preços imbatíveis, 
          <span className="text-cyan-400 font-semibold"> tenha infraestrutura premium</span> com VPS e VPN, e 
          <span className="text-yellow-400 font-semibold"> processe pagamentos</span> com AxionPay.
        </p>

        {/* Subheading */}
        <p className="text-xl sm:text-2xl font-semibold text-gray-200 mb-12">
          Tudo que você precisa para operar no universo digital, com segurança, velocidade e resultados garantidos.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
          >
            Começar Agora →
          </button>
          <button 
            onClick={handleSeePlans}
            className="bg-gray-900 border-2 border-gray-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:border-white hover:bg-gray-800 transition-all transform hover:scale-105"
          >
            Ver Planos VIP
          </button>
        </div>
      </div>
    </section>
  )
}
