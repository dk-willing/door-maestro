import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiLockClosed } from 'react-icons/hi'
import { login } from '../api'
import toast from 'react-hot-toast'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    try {
      await login(username, password)
      onLogin()
    } catch (err) {
      toast.error(err.message || 'Invalid credentials')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <HiLockClosed className="text-gold" size={32} />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-gold font-bold text-2xl">DOOR</span>
            <span className="text-dark-text font-light text-2xl">MAESTRO</span>
          </div>
          <p className="text-dark-muted text-sm">Sign in to the admin panel</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-dark-muted text-xs font-medium mb-1.5 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                autoFocus
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text text-sm outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="text-dark-muted text-xs font-medium mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text text-sm outline-none focus:border-gold transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold !py-3 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
