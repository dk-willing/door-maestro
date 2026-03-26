import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchProducts } from '../api'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">Our Security Doors</h1>
          <p className="text-dark-muted text-lg">Explore our complete collection of premium security doors</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="rounded-xl overflow-hidden">
                <div className="skeleton h-48 w-full" />
                <div className="bg-dark-card p-5 space-y-3">
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-8 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-6xl mb-4 opacity-20">🚪</div>
            <p className="text-dark-muted text-lg mb-2">No doors available yet</p>
            <p className="text-dark-muted text-sm">Our collection is being updated. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
