import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiExclamation, HiPencil, HiX, HiCheck } from "react-icons/hi";
import {
  fetchProducts,
  updateStock,
  updateProduct,
  deleteProduct,
} from "../api";
import toast from "react-hot-toast";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const load = () => {
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleStock = async (id, stock) => {
    await updateStock(id, stock);
    toast.success("Stock updated");
    load();
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setEditForm({
      name: p.name,
      price: p.price,
      description: p.description || "",
      material: p.material || "",
      size: p.size || "",
      country: p.country || "",
      stock: p.stock,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    try {
      const fd = new FormData();
      Object.entries(editForm).forEach(([k, v]) => fd.append(k, v));
      await updateProduct(id, fd);
      toast.success("Product updated");
      setEditingId(null);
      load();
    } catch {
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Inventory Management</h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-16 rounded-lg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-dark-muted">
          <p className="text-lg mb-2">No products to manage</p>
          <p className="text-sm">Add products first to manage inventory</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((p) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-card border border-dark-border rounded-xl overflow-hidden"
            >
              {/* Product Header */}
              <div
                className={`flex items-center justify-between px-5 py-4 border-b border-dark-border
                ${p.stock === 0 ? "bg-red-500/5" : p.stock <= 3 ? "bg-amber-500/5" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-dark-surface shrink-0">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-dark-muted text-xs">
                        No img
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-dark-text font-semibold">{p.name}</p>
                    <p className="text-gold text-sm font-medium">
                      ₵{Number(p.price).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {p.stock === 0 ? (
                    <span className="flex items-center gap-1 text-red-400 text-xs font-medium">
                      <HiExclamation /> Out of Stock
                    </span>
                  ) : p.stock <= 3 ? (
                    <span className="flex items-center gap-1 text-amber-400 text-xs font-medium">
                      <HiExclamation /> Low Stock
                    </span>
                  ) : (
                    <span className="text-emerald-400 text-xs font-medium">
                      In Stock
                    </span>
                  )}
                  <button
                    onClick={() =>
                      editingId === p._id ? cancelEdit() : startEdit(p)
                    }
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors
                      ${
                        editingId === p._id
                          ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                          : "bg-gold/10 text-gold border-gold/20 hover:bg-gold/20"
                      }`}
                  >
                    {editingId === p._id ? (
                      <>
                        <HiX size={14} /> Cancel
                      </>
                    ) : (
                      <>
                        <HiPencil size={14} /> Edit
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Edit Form */}
              {editingId === p._id ? (
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Name", key: "name", type: "text" },
                      { label: "Price (₵)", key: "price", type: "number" },
                      { label: "Material", key: "material", type: "text" },
                      { label: "Size", key: "size", type: "text" },
                      {
                        label: "Country of Origin",
                        key: "country",
                        type: "text",
                      },
                      { label: "Stock", key: "stock", type: "number" },
                    ].map(({ label, key, type }) => (
                      <div key={key}>
                        <label className="text-dark-muted text-xs mb-1.5 block">
                          {label}
                        </label>
                        <input
                          type={type}
                          value={editForm[key]}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              [key]: e.target.value,
                            }))
                          }
                          className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-dark-text text-sm outline-none focus:border-gold transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="text-dark-muted text-xs mb-1.5 block">
                      Description
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-dark-text text-sm outline-none focus:border-gold transition-colors resize-none"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => saveEdit(p._id)}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gold text-dark-bg text-sm font-semibold cursor-pointer hover:bg-gold/90 transition-colors"
                    >
                      <HiCheck size={16} /> Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                /* Stock Update Row */
                <div className="flex items-center justify-between px-5 py-3">
                  <span className="text-dark-muted text-sm">
                    Stock:{" "}
                    <span className="text-dark-text font-medium">
                      {p.stock} units
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      defaultValue={p.stock}
                      min="0"
                      className="w-20 bg-dark-surface border border-dark-border rounded-lg px-3 py-1.5 text-dark-text text-sm outline-none focus:border-gold transition-colors text-center"
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleStock(p._id, parseInt(e.target.value) || 0);
                      }}
                      id={`stock-${p._id}`}
                    />
                    <button
                      onClick={() => {
                        const val = document.getElementById(
                          `stock-${p._id}`,
                        ).value;
                        handleStock(p._id, parseInt(val) || 0);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-xs font-medium border border-gold/20 cursor-pointer hover:bg-gold/20 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
