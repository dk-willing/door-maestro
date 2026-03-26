import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiCube, HiClipboardList, HiDatabase } from 'react-icons/hi'
import { fetchStats } from '../api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats().then(setStats).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3].map(i => <div key={i} className="skeleton h-28 rounded-xl" />)}
      </div>
      <div className="skeleton h-64 rounded-xl" />
    </div>
  )

  const cards = [
    { icon: HiCube, label: 'Total Products', value: stats?.totalProducts || 0, color: 'text-gold' },
    { icon: HiClipboardList, label: 'Orders Received', value: stats?.totalOrders || 0, color: 'text-emerald-400' },
    { icon: HiDatabase, label: 'Total Inventory', value: stats?.totalStock || 0, color: 'text-blue-400' },
  ]

  const maxCount = Math.max(...(stats?.recentOrders || []).map(o => o.count), 1)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-dark-card border border-dark-border rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-dark-surface flex items-center justify-center">
                <c.icon className={c.color} size={24} />
              </div>
              <div>
                <p className="text-dark-muted text-sm">{c.label}</p>
                <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="text-dark-text font-semibold mb-6">Orders Over Time</h3>
        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="flex items-end gap-2 h-48">
            {stats.recentOrders.slice().reverse().map((o, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-dark-muted text-xs">{o.count}</span>
                <div
                  className="w-full bg-gradient-to-t from-gold-dark to-gold rounded-t-md transition-all"
                  style={{ height: `${(o.count / maxCount) * 100}%`, minHeight: '8px' }}
                />
                <span className="text-dark-muted text-xs truncate w-full text-center">{o.date.slice(5)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-dark-muted">
            No order data yet
          </div>
        )}
      </div>
    </div>
  )
}
