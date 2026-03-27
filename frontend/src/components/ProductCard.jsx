import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ProductCard({ product }) {
  const inStock = product.stock > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-hover bg-dark-card border border-dark-border rounded-xl overflow-hidden group"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-dark-surface flex items-center justify-center text-dark-muted">
            No Image
          </div>
        )}
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${inStock ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-dark-text font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-dark-muted text-sm mb-3">
          {product.country && <span>{product.country}</span>}
          {product.size && <span> &middot; {product.size}</span>}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-gold font-bold text-xl">${Number(product.price).toLocaleString()}</span>
          <Link
            to={`/doors/${product._id}`}
            className="btn-outline !py-2 !px-4 text-sm"
          >
            Order Now
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
