import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiMenu, HiX } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const links = [
    { to: '/', label: 'Home' },
    { to: '/doors', label: 'Doors' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-gold font-bold text-xl tracking-wide">DOOR</span>
          <span className="text-dark-text font-light text-xl">MAESTRO</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium no-underline transition-colors duration-300 ${pathname === l.to ? 'text-gold' : 'text-dark-muted hover:text-dark-text'}`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/doors" className="btn-gold text-sm !py-2 !px-5">Browse Doors</Link>
        </div>

        <button
          className="md:hidden text-dark-text bg-transparent border-none cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {open ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-dark-border"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium no-underline ${pathname === l.to ? 'text-gold' : 'text-dark-muted'}`}
                >
                  {l.label}
                </Link>
              ))}
              <Link to="/doors" onClick={() => setOpen(false)} className="btn-gold text-sm text-center !py-2">
                Browse Doors
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
