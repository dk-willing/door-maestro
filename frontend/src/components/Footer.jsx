import { FaWhatsapp, FaInstagram, FaFacebookF, FaMapMarkerAlt, FaPhone } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-dark-card border-t border-dark-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-gold font-bold text-xl">DOOR</span>
            <span className="text-dark-text font-light text-xl">MAESTRO</span>
          </div>
          <p className="text-dark-muted text-sm leading-relaxed">
            Premium security doors built for strength, style, and lasting protection.
          </p>
        </div>

        <div>
          <h4 className="text-dark-text font-semibold mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {[['/', 'Home'], ['/doors', 'Doors'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, label]) => (
              <Link key={to} to={to} className="text-dark-muted text-sm no-underline hover:text-gold transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-dark-text font-semibold mb-4">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-dark-muted">
            <div className="flex items-center gap-2">
              <FaPhone className="text-gold" /> +233 (554) 391-919
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-gold" /> Odorkor-Terrazo, Accra, Ghana
            </div>
            <div className="flex gap-3 mt-2">
              <a href="https://wa.me/233554391919" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-dark-muted hover:text-gold hover:border-gold transition-all">
                <FaWhatsapp />
              </a>
              <a href="https://www.instagram.com/buildwithdave.gh?igsh=MXRxdm5qZzgwZzBiMg%3D%3D&utm_source=qr" target='_blank' className="w-9 h-9 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-dark-muted hover:text-gold hover:border-gold transition-all">
                <FaInstagram />
              </a>
              <a href="https://www.facebook.com/share/1AsPUkke3P/?mibextid=wwXIfr" target='_blank' className="w-9 h-9 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-dark-muted hover:text-gold hover:border-gold transition-all">
                <FaFacebookF />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-dark-border py-4 text-center text-dark-muted text-xs">
        &copy; {new Date().getFullYear()} Door Maestro. All rights reserved.
      </div>
    </footer>
  )
}
