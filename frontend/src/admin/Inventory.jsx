import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiExclamation } from 'react-icons/hi'
import { fetchProducts, updateStock } from '../api'
import toast from 'react-hot-toast'

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetchProducts().then(setProducts).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleStock = async (id, stock) => {
    await updateStock(id, stock)
    toast.success('Stock updated')
    load()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Inventory Management</h1>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="skeleton h-16 rounded-lg" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-dark-muted">
          <p className="text-lg mb-2">No products to manage</p>
          <p className="text-sm">Add products first to manage inventory</p>
        </div>
      ) : (
        <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left text-dark-muted text-xs font-medium uppercase px-4 py-3">Product</th>
                  <th className="text-left text-dark-muted text-xs font-medium uppercase px-4 py-3">Current Stock</th>
                  <th className="text-left text-dark-muted text-xs font-medium uppercase px-4 py-3">Status</th>
                  <th className="text-right text-dark-muted text-xs font-medium uppercase px-4 py-3">Update</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`border-b border-dark-border last:border-0 transition-colors ${p.stock <= 3 && p.stock > 0 ? 'bg-amber-500/5' : ''} ${p.stock === 0 ? 'bg-red-500/5' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-dark-surface shrink-0">
                          {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : null}
                        </div>
                        <span className="text-dark-text text-sm font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-dark-text text-sm font-medium">{p.stock}</td>
                    <td className="px-4 py-3">
                      {p.stock === 0 ? (
                        <span className="flex items-center gap-1 text-red-400 text-xs font-medium"><HiExclamation /> Out of Stock</span>
                      ) : p.stock <= 3 ? (
                        <span className="flex items-center gap-1 text-amber-400 text-xs font-medium"><HiExclamation /> Low Stock</span>
                      ) : (
                        <span className="text-emerald-400 text-xs font-medium">In Stock</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <input
                          type="number"
                          defaultValue={p.stock}
                          min="0"
                          className="w-20 bg-dark-surface border border-dark-border rounded-lg px-3 py-1.5 text-dark-text text-sm outline-none focus:border-gold transition-colors text-center"
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleStock(p.id, parseInt(e.target.value) || 0)
                          }}
                          id={`stock-${p.id}`}
                        />
                        <button
                          onClick={() => {
                            const val = document.getElementById(`stock-${p.id}`).value
                            handleStock(p.id, parseInt(val) || 0)
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-xs font-medium border border-gold/20 cursor-pointer hover:bg-gold/20 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
