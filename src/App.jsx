import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Header from './components/Header'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Services from './components/Services'
import Testimonials from './components/Testimonials'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import AdminPanel from './components/AdminPanel'
import PaymentSuccess from './components/PaymentSuccess'
import AffiliatePanel from './components/AffiliatePanel'

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={
          <div className="min-h-screen bg-black text-white">
            <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
            <Hero />
            <Stats />
            <Services />
            <Testimonials />
            <Pricing />
            <Contact />
            <Footer />
          </div>
        } />
        
        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Admin Panel */}
        <Route path="/admin" element={<AdminPanel />} />
        
        {/* Payment Success */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
        
        {/* Affiliate Panel */}
        <Route path="/affiliate" element={<AffiliatePanel />} />
      </Routes>
    </Router>
  )
}

export default App
