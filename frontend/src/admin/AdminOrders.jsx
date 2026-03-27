import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiCheck } from "react-icons/hi";
import { fetchOrders, updateOrderStatus } from "../api";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const markProcessed = async (id) => {
    await updateOrderStatus(id, "processed");
    toast.success("Order marked as processed");
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Orders</h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 rounded-lg" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-dark-muted">
          <p className="text-lg mb-2">No orders yet</p>
          <p className="text-sm">
            Orders will appear here when customers place them
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-card border border-dark-border rounded-xl p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-dark-text font-medium">
                    {o.product_name || "Unknown Product"}
                  </p>
                  <p className="text-dark-muted text-sm">Qty: {o.quantity}</p>
                  <p className="text-dark-muted text-sm">
                    {o.customer_name} &middot;{" "}
                    <a
                      href={`tel:${o.phone}`}
                      className="hover:text-gold transition-colors"
                    >
                      {o.phone}
                    </a>
                  </p>
                  {o.note && (
                    <p className="text-dark-muted text-xs italic">"{o.note}"</p>
                  )}
                  <p className="text-dark-muted text-xs">
                    {new Date(o.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${o.status === "processed" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}
                  >
                    {o.status === "processed" ? "Processed" : "Pending"}
                  </span>
                  {o.status !== "processed" && (
                    <button
                      onClick={() => markProcessed(o.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/20 transition-colors"
                    >
                      <HiCheck size={14} /> Mark Processed
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
