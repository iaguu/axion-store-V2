const AXION_PAY_CONFIG = {
  baseURL: 'https://pay.axionenterprise.cloud',
  headers: {
    'pay-tag': 'user-test',
    'Content-Type': 'application/json'
  }
}

export const createPayment = async (paymentData) => {
  try {
    const { method = 'pix', ...data } = paymentData
    const endpoint = method === 'pix' ? '/payments/pix' : '/payments/card'
    
    const payload = {
      amount: data.amount,
      currency: 'BRL',
      method,
      capture: true,
      customer: {
        name: data.customerName,
        email: data.customerEmail,
        phone_number: data.customerPhone,
        document: {
          type: 'cpf',
          number: data.customerCpf
        }
      },
      billing_address: {
        street: data.billingStreet || 'Rua Exemplo',
        number: data.billingNumber || '123',
        complement: data.billingComplement || '',
        neighborhood: data.billingNeighborhood || 'Centro',
        city: data.billingCity || 'São Paulo',
        state: data.billingState || 'SP',
        country: 'BR',
        zipcode: data.billingZipcode || '01001000'
      },
      shipping_address: data.sameAsBilling ? {
        street: data.billingStreet || 'Rua Exemplo',
        number: data.billingNumber || '123',
        complement: data.billingComplement || '',
        neighborhood: data.billingNeighborhood || 'Centro',
        city: data.billingCity || 'São Paulo',
        state: data.billingState || 'SP',
        country: 'BR',
        zipcode: data.billingZipcode || '01001000'
      } : {
        street: data.shippingStreet || 'Rua Exemplo',
        number: data.shippingNumber || '123',
        complement: data.shippingComplement || '',
        neighborhood: data.shippingNeighborhood || 'Centro',
        city: data.shippingCity || 'São Paulo',
        state: data.shippingState || 'SP',
        country: 'BR',
        zipcode: data.shippingZipcode || '01001000'
      },
      items: data.items || [],
      metadata: {
        orderId: data.orderId || `ORDER-${Date.now()}`,
        source: 'axion-store',
        integration: 'axionpay',
        customer_ip: data.customerIp || '189.10.20.30',
        user_agent: navigator.userAgent
      }
    }

    const response = await fetch(`${AXION_PAY_CONFIG.baseURL}${endpoint}`, {
      method: 'POST',
      headers: AXION_PAY_CONFIG.headers,
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Erro no pagamento: ${response.status}`)
    }

    const result = await response.json()
    
    if (!result.ok) {
      throw new Error(result.error || 'Erro ao processar pagamento')
    }

    return result.transaction
  } catch (error) {
    console.error('Erro ao processar pagamento:', error)
    throw error
  }
}

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const generateOrderId = () => {
  return `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}
