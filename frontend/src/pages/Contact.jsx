import {motion} from "framer-motion"
import { FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

export default function Contact() {
  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-dark-muted text-lg">Get in touch for quotes, inquiries, or support</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {[
              { icon: FaWhatsapp, label: 'WhatsApp', value: '+233 (554) 391-919', href: 'https://wa.me/233554391919' },
              { icon: FaPhone, label: 'Phone', value: '+233 (554) 391-919', href: 'tel:+233554391919' },
              { icon: FaEnvelope, label: 'Email', value: 'info@doormaestro.com', href: 'mailto:doorkingsonline@gmail.com' },
              { icon: FaMapMarkerAlt, label: 'Address', value: 'Odorkor-Terrazo, Accra, Ghana' },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-dark-card border border-dark-border rounded-xl p-6 flex items-center gap-5 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                  <c.icon className="text-gold" size={22} />
                </div>
                <div>
                  <p className="text-dark-muted text-sm mb-1">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noreferrer" className="text-dark-text no-underline hover:text-gold transition-colors font-medium">
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-dark-text font-medium">{c.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-dark-card border border-dark-border rounded-xl p-8"
          >
            <h3 className="text-white font-semibold text-lg mb-6">Send us a Message</h3>
            <form
              onSubmit={e => {
                e.preventDefault()
                const fd = new FormData(e.target)
                const msg = encodeURIComponent(`Hi! My name is ${fd.get('name')}.\n\n${fd.get('message')}\n\nPhone: ${fd.get('phone')}`)
                window.open(`https://wa.me/233554391919?text=${msg}`, '_blank')
              }}
              className="flex flex-col gap-4"
            >
              <input name="name" type="text" placeholder="Your Name" required
                className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text text-sm outline-none focus:border-gold transition-colors" />
              <input name="phone" type="tel" placeholder="Phone Number" required
                className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text text-sm outline-none focus:border-gold transition-colors" />
              <textarea name="message" placeholder="Your Message" rows={4} required
                className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text text-sm outline-none focus:border-gold transition-colors resize-none" />
              <button type="submit" className="btn-gold flex items-center justify-center gap-2 !py-3">
                <FaWhatsapp size={18} /> Send via WhatsApp
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
