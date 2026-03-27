import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import { createOrder } from "../api";
import toast from "react-hot-toast";

export default function OrderModal({ product, quantity, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", note: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Please fill in your name and phone number");
      return;
    }

    const msg = encodeURIComponent(
      `🚪 *DOOR MAESTRO — NEW ORDER*\n` +
        `━━━━━━━━━━━━━━━━━\n\n` +
        `📦 *Product Details*\n` +
        `› Name: ${product.name}\n` +
        `› Quantity: ${quantity} unit${quantity > 1 ? "s" : ""}\n` +
        `› Unit Price: $${Number(product.price).toLocaleString()}\n` +
        `› *Total: $${(product.price * quantity).toLocaleString()}*\n\n` +
        `━━━━━━━━━━━━━━━━━\n` +
        `👤 *Customer Details*\n` +
        `› Name: ${form.name}\n` +
        `› Phone: ${form.phone}\n` +
        (form.note ? `› Note: ${form.note}\n` : "") +
        `━━━━━━━━━━━━━━━━━\n\n` +
        `_Sent via Door Maestro Store_ ✨`,
    );

    // Open the window immediately (before any await) so mobile doesn't block it
    const waWindow = window.open(
      `https://wa.me/233554391919?text=${msg}`,
      "_blank",
    );

    setLoading(true);
    try {
      await createOrder({
        product_id: product._id, // fixed: MongoDB uses _id
        product_name: product.name,
        quantity,
        customer_name: form.name,
        phone: form.phone,
        note: form.note,
      });
      toast.success("Order placed! Redirecting to WhatsApp...");
      onClose();
    } catch {
      toast.error("Something went wrong");
      waWindow?.close(); // close the WhatsApp tab if order failed
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-md"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-dark-text font-semibold text-lg">
              Complete Your Order
            </h3>
            <button
              onClick={onClose}
              className="text-dark-muted hover:text-dark-text bg-transparent border-none cursor-pointer"
            >
              <HiX size={20} />
            </button>
          </div>

          <div className="bg-dark-surface rounded-lg p-4 mb-6">
            <p className="text-dark-text font-medium">{product.name}</p>
            <p className="text-dark-muted text-sm">
              Qty: {quantity} &middot; Total: $
              {(product.price * quantity).toLocaleString()}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text text-[16px] md:text-sm outline-none focus:border-gold transition-colors"
            />
            <input
              type="tel"
              placeholder="Phone Number *"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text text-[16px] md:text-sm outline-none focus:border-gold transition-colors"
            />
            <textarea
              placeholder="Additional notes (optional)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={3}
              className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text text-[16px] md:text-sm outline-none focus:border-gold transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-gold flex items-center justify-center gap-2 !py-3"
            >
              <FaWhatsapp size={18} />
              {loading ? "Processing..." : "Order via WhatsApp"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
