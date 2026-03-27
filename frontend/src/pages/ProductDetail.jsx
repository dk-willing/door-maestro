import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiShieldCheck, HiClock, HiBadgeCheck } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import { fetchProduct } from '../api'
import OrderModal from '../components/OrderModal'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showOrder, setShowOrder] = useState(false)

  useEffect(() => {
    fetchProduct(id).then(p => { setProduct(p); setLoading(false) }).catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="skeleton h-96 rounded-xl" />
        <div className="space-y-4">
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-6 w-1/2" />
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-12 w-1/3" />
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="pt-24 pb-16 px-6 text-center">
      <p className="text-dark-muted text-lg">Product not found</p>
    </div>
  )

  const inStock = product.stock > 0

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="rounded-xl overflow-hidden bg-dark-card border border-dark-border aspect-square mb-4">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[selectedImg]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-dark-muted">No Image</div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all bg-transparent p-0 ${i === selectedImg ? 'border-gold' : 'border-dark-border hover:border-dark-muted'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${inStock ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {inStock ? 'In Stock' : 'Out of Stock'}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{product.name}</h1>
              <p className="text-gold text-3xl font-bold">₵{Number(product.price).toLocaleString()}</p>
            </div>

            {product.description && (
              <p className="text-dark-muted leading-relaxed">{product.description}</p>
            )}

            {/* Specs */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-5">
              <h3 className="text-dark-text font-semibold mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.size && <div><span className="text-dark-muted">Size:</span> <span className="text-dark-text">{product.size}</span></div>}
                {product.material && <div><span className="text-dark-muted">Material:</span> <span className="text-dark-text">{product.material}</span></div>}
                {product.country && <div><span className="text-dark-muted">Origin:</span> <span className="text-dark-text">{product.country}</span></div>}
                <div><span className="text-dark-muted">Stock:</span> <span className="text-dark-text">{product.stock} units</span></div>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-dark-muted text-sm">Quantity:</span>
              <div className="flex items-center border border-dark-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 bg-dark-surface text-dark-text border-none cursor-pointer hover:bg-dark-border transition-colors text-lg"
                >-</button>
                <span className="w-12 h-10 flex items-center justify-center text-dark-text bg-dark-card text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 bg-dark-surface text-dark-text border-none cursor-pointer hover:bg-dark-border transition-colors text-lg"
                >+</button>
              </div>
            </div>

            {/* Order Button */}
            <button
              onClick={() => setShowOrder(true)}
              disabled={!inStock}
              className="btn-gold w-full flex items-center justify-center gap-3 !py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaWhatsapp size={20} />
              Order via WhatsApp
            </button>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: HiShieldCheck, label: 'Secure Purchase' },
                { icon: HiBadgeCheck, label: 'Premium Quality' },
              ].map((t, i) => (
                <div key={i} className="text-center">
                  <t.icon className="text-gold mx-auto mb-1" size={22} />
                  <span className="text-dark-muted text-xs">{t.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {showOrder && <OrderModal product={product} quantity={quantity} onClose={() => setShowOrder(false)} />}
    </div>
  )
}
