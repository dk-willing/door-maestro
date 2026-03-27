import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiCheck,
  HiClock,
  HiFilter,
  HiRefresh,
  HiChevronDown,
  HiCalendar,
  HiShoppingCart,
  HiX,
} from "react-icons/hi";
import { fetchOrders, updateOrderStatus } from "../api";
import toast from "react-hot-toast";

const STATUSES = [
  { value: "all", label: "All Orders", color: null },
  { value: "pending", label: "Pending", color: "amber" },
  { value: "processed", label: "Processed", color: "emerald" },
];

const DATE_RANGES = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "custom", label: "Custom range" },
];

const STATUS_STYLES = {
  pending: {
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    dot: "bg-amber-400",
  },
  processed: {
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    dot: "bg-emerald-400",
  },
};

function getOrderId(order) {
  return order?.id ?? order?._id ?? null;
}

function isInRange(dateStr, range, customFrom, customTo) {
  const d = new Date(dateStr);
  const now = new Date();
  if (range === "today") {
    return d.toDateString() === now.toDateString();
  }
  if (range === "week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return d >= weekAgo;
  }
  if (range === "month") {
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }
  if (range === "custom" && customFrom && customTo) {
    const from = new Date(customFrom);
    from.setHours(0, 0, 0, 0);
    const to = new Date(customTo);
    to.setHours(23, 59, 59, 999);
    return d >= from && d <= to;
  }
  return true;
}

/* ── small atoms ── */
const Label = ({ children }) => (
  <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">
    {children}
  </p>
);

const StatCard = ({ label, value, color }) => (
  <div className="flex-1 min-w-[90px] rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-zinc-500 text-xs mt-0.5">{label}</p>
  </div>
);

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [customFrom, setFrom] = useState("");
  const [customTo, setTo] = useState("");
  const [updating, setUpdating] = useState(null); // order id being updated
  const [showFilters, setShowFilters] = useState(false);

  const load = () => {
    setLoading(true);
    fetchOrders()
      .then((data) =>
        setOrders(
          Array.isArray(data) ? data : (data?.orders ?? data?.data ?? []),
        ),
      )
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const markProcessed = async (id) => {
    if (!id) {
      toast.error("Order ID missing");
      return;
    }

    setUpdating(id);
    try {
      await updateOrderStatus(id, "processed");
      toast.success("Order marked as processed");
      setOrders((prev) =>
        prev.map((o) =>
          getOrderId(o) === id ? { ...o, status: "processed" } : o,
        ),
      );
    } catch {
      toast.error("Failed to update order");
    }
    setUpdating(null);
  };

  const markPending = async (id) => {
    if (!id) {
      toast.error("Order ID missing");
      return;
    }

    setUpdating(id);
    try {
      await updateOrderStatus(id, "pending");
      toast.success("Order reverted to pending");
      setOrders((prev) =>
        prev.map((o) =>
          getOrderId(o) === id ? { ...o, status: "pending" } : o,
        ),
      );
    } catch {
      toast.error("Failed to update order");
    }
    setUpdating(null);
  };

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const statusOk = statusFilter === "all" || o.status === statusFilter;
        const dateOk = isInRange(o.created_at, dateRange, customFrom, customTo);
        return statusOk && dateOk;
      }),
    [orders, statusFilter, dateRange, customFrom, customTo],
  );

  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((o) => o.status !== "processed").length,
      processed: orders.filter((o) => o.status === "processed").length,
    }),
    [orders],
  );

  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) + (dateRange !== "all" ? 1 : 0);

  return (
    <div className="max-w-3xl space-y-6">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HiShoppingCart className="text-amber-400" size={22} />
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
              Orders
            </h1>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 text-xs font-medium transition-colors cursor-pointer"
          >
            <HiRefresh size={14} /> Refresh
          </button>
        </div>
        <p className="text-zinc-500 text-sm pl-9 mt-0.5">
          Track and manage customer orders
        </p>
      </motion.div>

      {/* stat chips */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-3 flex-wrap"
      >
        <StatCard label="Total" value={stats.total} color="text-zinc-100" />
        <StatCard
          label="Pending"
          value={stats.pending}
          color="text-amber-400"
        />
        <StatCard
          label="Processed"
          value={stats.processed}
          color="text-emerald-400"
        />
      </motion.div>

      {/* filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm overflow-hidden"
      >
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
        >
          <div className="flex items-center gap-2 text-zinc-300 font-medium text-sm">
            <HiFilter size={16} className="text-amber-400" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>
          <HiChevronDown
            size={16}
            className={`text-zinc-500 transition-transform ${showFilters ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-zinc-800"
            >
              <div className="p-5 space-y-5">
                {/* status filter */}
                <div>
                  <Label>Status</Label>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setStatus(s.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          statusFilter === s.value
                            ? "bg-amber-500 text-zinc-900 border-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                            : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* date range */}
                <div>
                  <Label>Date Range</Label>
                  <div className="flex flex-wrap gap-2">
                    {DATE_RANGES.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => setDateRange(r.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          dateRange === r.value
                            ? "bg-amber-500 text-zinc-900 border-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                            : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* custom date inputs */}
                <AnimatePresence>
                  {dateRange === "custom" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row gap-3 pt-1">
                        <div className="flex-1">
                          <Label>From</Label>
                          <div className="relative">
                            <input
                              type="date"
                              value={customFrom}
                              onChange={(e) => setFrom(e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-amber-500/60 transition-colors"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <Label>To</Label>
                          <div className="relative">
                            <input
                              type="date"
                              value={customTo}
                              onChange={(e) => setTo(e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-amber-500/60 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* clear filters */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      setStatus("all");
                      setDateRange("all");
                      setFrom("");
                      setTo("");
                    }}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    <HiX size={13} /> Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* results label */}
      {!loading && (
        <p className="text-zinc-600 text-xs px-1">
          Showing{" "}
          <span className="text-zinc-400 font-medium">{filtered.length}</span>{" "}
          of <span className="text-zinc-400 font-medium">{orders.length}</span>{" "}
          orders
        </p>
      )}

      {/* order list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-zinc-800">
          <div className="w-14 h-14 rounded-full bg-zinc-800/60 flex items-center justify-center mb-4">
            <HiShoppingCart className="text-zinc-600" size={26} />
          </div>
          <p className="text-zinc-400 font-medium">No orders found</p>
          <p className="text-zinc-600 text-sm mt-1">
            {activeFilterCount > 0
              ? "Try adjusting your filters"
              : "Orders will appear here when customers place them"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((o, i) => {
              const style = STATUS_STYLES[o.status] ?? STATUS_STYLES.pending;
              const orderId = getOrderId(o);
              const isUpdating = updating === orderId;
              return (
                <motion.div
                  key={orderId ?? `${o.created_at}-${i}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm p-5 hover:border-zinc-700 transition-colors overflow-hidden"
                >
                  {/* left accent bar */}
                  <div
                    className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full ${o.status === "processed" ? "bg-emerald-500/50" : "bg-amber-500/50"}`}
                  />

                  <div className="flex flex-wrap items-start justify-between gap-4 pl-3">
                    {/* order info */}
                    <div className="space-y-1.5 min-w-0">
                      <p className="text-zinc-100 font-semibold text-sm leading-tight">
                        {o.product_name || "Unknown Product"}
                      </p>
                      <p className="text-zinc-500 text-xs">
                        Qty: <span className="text-zinc-300">{o.quantity}</span>
                      </p>
                      <p className="text-zinc-500 text-xs">
                        {o.customer_name}
                        {o.phone && (
                          <>
                            {" "}
                            &middot;{" "}
                            <a
                              href={`tel:${o.phone}`}
                              className="text-amber-400/80 hover:text-amber-400 transition-colors"
                            >
                              {o.phone}
                            </a>
                          </>
                        )}
                      </p>
                      {o.note && (
                        <p className="text-zinc-600 text-xs italic">
                          "{o.note}"
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 text-zinc-600 text-xs pt-0.5">
                        <HiCalendar size={11} />
                        {new Date(o.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        <span className="opacity-50">·</span>
                        {new Date(o.created_at).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    {/* status + actions */}
                    <div className="flex flex-col items-end gap-2.5 shrink-0">
                      {/* status badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.badge}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                        />
                        {o.status === "processed" ? "Processed" : "Pending"}
                      </span>

                      {/* action buttons */}
                      <div className="flex gap-2">
                        {o.status !== "processed" ? (
                          <button
                            onClick={() => markProcessed(orderId)}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium hover:bg-emerald-500/20 disabled:opacity-50 transition-colors cursor-pointer"
                          >
                            {isUpdating ? (
                              <HiClock size={13} className="animate-spin" />
                            ) : (
                              <HiCheck size={13} />
                            )}
                            {isUpdating ? "Updating…" : "Mark Processed"}
                          </button>
                        ) : (
                          <button
                            onClick={() => markPending(orderId)}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700 text-xs font-medium hover:bg-zinc-700 hover:text-zinc-200 disabled:opacity-50 transition-colors cursor-pointer"
                          >
                            {isUpdating ? (
                              <HiClock size={13} className="animate-spin" />
                            ) : (
                              <HiRefresh size={13} />
                            )}
                            {isUpdating ? "Updating…" : "Revert to Pending"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
