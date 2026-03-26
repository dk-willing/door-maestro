import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { HiViewGrid, HiCube, HiClipboardList, HiDatabase, HiCog, HiMenu, HiX, HiLogout } from 'react-icons/hi'
import { verifyAuth, logout } from '../api'
import Login from './Login'

const links = [
  { to: '/admin', icon: HiViewGrid, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: HiCube, label: 'Products' },
  { to: '/admin/orders', icon: HiClipboardList, label: 'Orders' },
  { to: '/admin/inventory', icon: HiDatabase, label: 'Inventory' },
  { to: '/admin/settings', icon: HiCog, label: 'Settings' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const navigate = useNavigate()

  const checkAuth = () => {
    setChecking(true)
    verifyAuth()
      .then(() => setAuthed(true))
      .catch(() => { setAuthed(false); logout() })
      .finally(() => setChecking(false))
  }

  useEffect(checkAuth, [])

  const handleLogout = () => {
    logout()
    setAuthed(false)
  }

  if (checking) return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!authed) return <Login onLogin={() => setAuthed(true)} />

  return (
    <div className="flex min-h-screen bg-dark">
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-dark-card border-r border-dark-border transform transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center px-6 border-b border-dark-border">
          <span className="text-gold font-bold text-lg">DOOR</span>
          <span className="text-dark-text font-light text-lg ml-1">MAESTRO</span>
          <span className="text-dark-muted text-xs ml-2">Admin</span>
        </div>
        <nav className="p-4 flex flex-col gap-1 flex-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium no-underline transition-all ${isActive ? 'bg-gold/10 text-gold' : 'text-dark-muted hover:text-dark-text hover:bg-dark-surface'}`
              }
            >
              <l.icon size={20} />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-dark-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-dark-muted hover:text-red-400 hover:bg-red-500/10 transition-all w-full bg-transparent border-none cursor-pointer"
          >
            <HiLogout size={20} />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center px-6 border-b border-dark-border bg-dark-card/50 shrink-0">
          <button
            className="lg:hidden mr-4 text-dark-text bg-transparent border-none cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
          <h2 className="text-dark-text font-semibold">Admin Panel</h2>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
