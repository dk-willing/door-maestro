// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { HiShieldCheck, HiUserGroup, HiGlobe } from 'react-icons/hi'

export default function About() {
  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">About Door Maestro</h1>
          <p className="text-dark-muted text-lg max-w-2xl mx-auto leading-relaxed">
            We are dedicated to providing the finest security doors that combine cutting-edge protection technology with sophisticated design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: HiShieldCheck, title: '6+ Years', desc: 'Of excellence in security door distribution.' },
            { icon: HiUserGroup, title: '5,000+ Clients', desc: 'Trust us to protect their homes and businesses.' },
            { icon: HiGlobe, title: 'Global Sourcing', desc: 'Premium materials from top manufacturers worldwide.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-dark-card border border-dark-border rounded-xl p-8 text-center card-hover"
            >
              <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-5">
                <item.icon className="text-gold" size={28} />
              </div>
              <h3 className="text-gold font-bold text-2xl mb-2">{item.title}</h3>
              <p className="text-dark-muted text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-dark-muted leading-relaxed mb-6">
            At Door Maestro, we believe that security and style should never be compromised. Every door in our collection is carefully selected and tested to meet the highest standards of durability, design, and protection.
          </p>
          <p className="text-dark-muted leading-relaxed">
            We partner with premium manufacturers from around the world to bring you doors that not only safeguard your property but elevate its aesthetic appeal. Our commitment to quality and customer satisfaction drives everything we do.
          </p>
        </div>
      </div>
    </div>
  )
}
