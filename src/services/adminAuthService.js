// Serviço de Autenticação Admin
import { sha256 } from '../utils/crypto'

class AdminAuthService {
  constructor() {
    this.isAuthenticated = false
    this.token = null
    this.user = null
  }

  async login(username, password) {
    try {
      const hashedPassword = await sha256(password)
      
      // Verificar credenciais (em produção, isso viria de API)
      const validCredentials = await this.getValidCredentials()
      
      if (validCredentials.username === username && 
          validCredentials.passwordHash === hashedPassword) {
        
        this.isAuthenticated = true
        this.token = validCredentials.token
        this.user = {
          username: validCredentials.username,
          email: validCredentials.email,
          role: 'admin'
        }
        
        // Salvar no sessionStorage
        sessionStorage.setItem('adminToken', this.token)
        sessionStorage.setItem('adminUser', JSON.stringify(this.user))
        
        return { success: true, user: this.user }
      }
      
      return { success: false, error: 'Credenciais inválidas' }
    } catch (error) {
      console.error('Erro no login admin:', error)
      return { success: false, error: 'Erro interno' }
    }
  }

  async getValidCredentials() {
    // Em produção, buscar de API segura
    return {
      username: 'admin@axionstore.com',
      passwordHash: await sha256('AxionMaster@2026!#%'),
      email: 'admin@axionstore.com',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLTAwMSIsIm5hbWUiOiJBZG1pbiBVc2VyIiwiZW1haWwiOiJhZG1pbkBheGlvbi5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Njc3NDAxNDUsImV4cCI6MTc2NzgyNjU0NSwiYXVkIjoiYXhpb24tY2xpZW50cyIsImlzcyI6ImF4aW9uLWRhdGEtYXBpIn0.Fz5_B2kX2QApMq_fHINBsjZvlKsw2x3XC3Qvf7LqNIM'
    }
  }

  logout() {
    this.isAuthenticated = false
    this.token = null
    this.user = null
    sessionStorage.removeItem('adminToken')
    sessionStorage.removeItem('adminUser')
  }

  checkAuth() {
    const token = sessionStorage.getItem('adminToken')
    const user = sessionStorage.getItem('adminUser')
    
    if (token && user) {
      this.isAuthenticated = true
      this.token = token
      this.user = JSON.parse(user)
      return true
    }
    
    return false
  }

  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    }
  }
}

export default new AdminAuthService()
