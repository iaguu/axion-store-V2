import { Check } from 'lucide-react'

export default function ServiceCard({ service }) {
  const Icon = service.icon
  const [colorStart, colorEnd] = service.color.split(' to-')

  return (
    <div className="group h-full">
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 h-full hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/50">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <Icon size={32} className="text-white" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 group-hover:text-gray-100 transition-colors">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-6 group-hover:text-gray-300 transition-colors">
          {service.description}
        </p>

        {/* Features */}
        <ul className="space-y-3">
          {service.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors">
          Saiba Mais
        </button>
      </div>
    </div>
  )
}
