import { useState } from 'react'
import { Star, ShoppingCart, TrendingUp, Package, Crown, CreditCard, Bot, Search, Cpu, Globe, Shield } from 'lucide-react'
import { categories, getAllProducts, getProductsByCategory } from '../data/products'
import { formatCurrency } from '../services/axionPay'
import QuickCheckout from './QuickCheckout'

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showCheckout, setShowCheckout] = useState(false)

  const allProducts = getAllProducts()
  const filteredProducts = selectedCategory === 'all' 
    ? allProducts 
    : getProductsByCategory(selectedCategory)

  const searchedProducts = filteredProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedProducts = [...searchedProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'name':
        return a.name.localeCompare(b.name)
      case 'popular':
        return b.popular - a.popular
      default:
        return 0
    }
  })

  const handlePurchase = (product) => {
    setSelectedProduct(product)
    setShowCheckout(true)
  }

  const handleCheckoutSuccess = (paymentData) => {
    console.log('Pagamento realizado:', paymentData)
    // Aqui você pode redirecionar para uma página de sucesso ou mostrar uma notificação
  }

  const ProductCard = ({ product }) => {
    const Icon = product.icon

    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/50 group">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon size={32} className="text-white" />
          </div>
          
          {product.popular && (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
              <TrendingUp size={12} className="text-yellow-400" />
              <span className="text-yellow-400 text-xs font-semibold">Popular</span>
            </div>
          )}
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-100 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {product.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="px-2 py-1 bg-gray-800 rounded-lg text-xs text-gray-300">
                {feature}
              </span>
            ))}
            {product.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-800 rounded-lg text-xs text-gray-400">
                +{product.features.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Stock and Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">
              {product.stock === 999999 ? 'Ilimitado' : `${product.stock} disponíveis`}
            </span>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {formatCurrency(product.price)}
            </div>
            {product.type === 'subscription' && (
              <div className="text-xs text-gray-400">/mês</div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => handlePurchase(product)}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            Comprar
          </button>
          
          <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
            <Star size={16} className="text-gray-400 hover:text-yellow-400" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Catálogo de Produtos</h1>
        <p className="text-gray-400">Explore nossa seleção premium de serviços e ferramentas</p>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors"
          >
            <option value="all">Todas Categorias</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors"
          >
            <option value="name">Ordenar por Nome</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
            <option value="popular">Mais Populares</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Todos
          </button>
          
          {categories.map(category => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Icon size={16} />
                {category.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum produto encontrado</h3>
          <p className="text-gray-400">Tente ajustar seus filtros ou termos de busca</p>
        </div>
      )}

      {/* Stats */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{allProducts.length}</div>
            <div className="text-sm text-gray-400">Produtos Totais</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{allProducts.filter(p => p.popular).length}</div>
            <div className="text-sm text-gray-400">Populares</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{categories.length}</div>
            <div className="text-sm text-gray-400">Categorias</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {allProducts.reduce((sum, p) => sum + p.stock, 0)}
            </div>
            <div className="text-sm text-gray-400">Em Estoque</div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedProduct && (
        <QuickCheckout
          product={selectedProduct}
          onClose={() => {
            setShowCheckout(false)
            setSelectedProduct(null)
          }}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  )
}
