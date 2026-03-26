import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import AdminProducts from './admin/AdminProducts'
import AdminOrders from './admin/AdminOrders'
import Inventory from './admin/Inventory'
import Settings from './admin/Settings'

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/doors" element={<Products />} />
              <Route path="/doors/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      } />
    </Routes>
  )
}

export default App
