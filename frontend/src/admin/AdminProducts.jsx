import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api'
import toast from 'react-hot-toast'

function ProductForm({ product, onSave, onClose }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    price: product?.price || '',
    description: product?.description || '',
    material: product?.material || '',
    size: product?.size || '',
    country: product?.country || '',
    stock: product?.stock || 0,
  })
  const [files, setFiles] = useState([])
  const [existingImages, setExistingImages] = useState(product?.images || [])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price) { toast.error('Name and price are required'); return }
    setLoading(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append('existingImages', JSON.stringify(existingImages))
    files.forEach(f => fd.append('images', f))
    try {
      if (product) await updateProduct(product.id, fd)
      else await createProduct(fd)
      toast.success(product ? 'Product updated' : 'Product created')
      onSave()
    } catch { toast.error('Failed to save') }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-dark-text font-semibold text-lg">{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="text-dark-muted hover:text-dark-text bg-transparent border-none cursor-pointer"><HiX size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input placeholder="Product Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text text-sm outline-none focus:border-gold transition-colors" />
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Price *" type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
              className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text text-sm outline-none focus:border-gold transition-colors" />
            <input placeholder="Stock Qty" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})}
              className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text text-sm outline-none focus:border-gold transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Size (e.g. 3x7 ft)" value={form.size} onChange={e => setForm({...form, size: e.target.value})}
              className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text text-sm outline-none focus:border-gold transition-colors" />
            <input placeholder="Country of Origin" value={form.country} onChange={e => setForm({...form, country: e.target.value})}
              className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text text-sm outline-none focus:border-gold transition-colors" />
          </div>
          <input placeholder="Material" value={form.material} onChange={e => setForm({...form, material: e.target.value})}
            className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text text-sm outline-none focus:border-gold transition-colors" />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3}
            className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text text-sm outline-none focus:border-gold transition-colors resize-none" />

          {existingImages.length > 0 && (
            <div>
              <p className="text-dark-muted text-xs mb-2">Current Images</p>
              <div className="flex gap-2 flex-wrap">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-dark-border">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setExistingImages(existingImages.filter((_, j) => j !== i))}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity border-none cursor-pointer"
                    ><HiX className="text-red-400" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <label className="bg-dark-surface border border-dashed border-dark-border rounded-lg px-4 py-4 text-dark-muted text-sm text-center cursor-pointer hover:border-gold transition-colors">
            {files.length > 0 ? `${files.length} file(s) selected` : 'Click to upload images'}
            <input type="file" multiple accept="image/*" className="hidden" onChange={e => setFiles([...e.target.files])} />
          </label>

          <button type="submit" disabled={loading} className="btn-gold !py-3">
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = () => {
    setLoading(true)
    fetchProducts().then(setProducts).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await deleteProduct(id)
    toast.success('Product deleted')
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-gold flex items-center gap-2 !py-2 !px-4 text-sm">
          <HiPlus size={18} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="skeleton h-16 rounded-lg" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-dark-muted">
          <p className="text-lg mb-2">No products yet</p>
          <p className="text-sm">Add your first product to get started</p>
        </div>
      ) : (
        <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left text-dark-muted text-xs font-medium uppercase px-4 py-3">Product</th>
                  <th className="text-left text-dark-muted text-xs font-medium uppercase px-4 py-3">Price</th>
                  <th className="text-left text-dark-muted text-xs font-medium uppercase px-4 py-3">Stock</th>
                  <th className="text-left text-dark-muted text-xs font-medium uppercase px-4 py-3">Status</th>
                  <th className="text-right text-dark-muted text-xs font-medium uppercase px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-dark-border last:border-0 hover:bg-dark-surface/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-dark-surface shrink-0">
                          {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : null}
                        </div>
                        <span className="text-dark-text text-sm font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gold text-sm font-medium">${Number(p.price).toLocaleString()}</td>
                    <td className="px-4 py-3 text-dark-text text-sm">{p.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => { setEditing(p); setShowForm(true) }}
                        className="text-dark-muted hover:text-gold bg-transparent border-none cursor-pointer p-1 mr-2">
                        <HiPencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(p.id)}
                        className="text-dark-muted hover:text-red-400 bg-transparent border-none cursor-pointer p-1">
                        <HiTrash size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <ProductForm
            product={editing}
            onSave={() => { setShowForm(false); load() }}
            onClose={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
