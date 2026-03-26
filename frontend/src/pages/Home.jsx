import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiShieldCheck, HiCube, HiStar } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { fetchProducts } from '../api'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts().then(p => { setProducts(p.slice(0, 4)); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-dark to-dark-card" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(200,168,78,0.15) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-gold text-sm font-semibold tracking-[0.2em] uppercase mb-6 border border-gold/30 px-4 py-1.5 rounded-full">
              Premium Security Doors
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Built for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
                Strength
              </span>
              <br />& Style
            </h1>
            <p className="text-dark-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover our collection of handcrafted security doors that combine uncompromising protection with elegant design.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/doors" className="btn-gold text-base !py-3 !px-8">Browse Doors</Link>
              <Link to="/contact" className="btn-outline text-base !py-3 !px-8">Get a Quote</Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent" />
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: HiShieldCheck, title: 'Maximum Security', desc: 'Multi-point locking systems and reinforced steel construction.' },
              { icon: HiCube, title: 'Premium Materials', desc: 'Sourced from the finest manufacturers worldwide.' },
              { icon: HiStar, title: 'Elegant Design', desc: 'Modern aesthetics that complement any architectural style.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-dark-card border border-dark-border rounded-xl p-8 text-center card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-5">
                  <f.icon className="text-gold" size={28} />
                </div>
                <h3 className="text-dark-text font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-dark-muted text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-6 bg-dark-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Featured Doors</h2>
            <p className="text-dark-muted">Our most popular security door models</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="rounded-xl overflow-hidden">
                  <div className="skeleton h-48 w-full" />
                  <div className="bg-dark-card p-5 space-y-3">
                    <div className="skeleton h-5 w-3/4" />
                    <div className="skeleton h-4 w-1/2" />
                    <div className="skeleton h-8 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-dark-muted">
              <p className="text-lg mb-2">No products yet</p>
              <p className="text-sm">Check back soon for our latest collection</p>
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/doors" className="btn-outline">View All Doors</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Secure Your Home?</h2>
          <p className="text-dark-muted text-lg mb-8">Get in touch with us for personalized recommendations and quotes.</p>
          <Link to="/contact" className="btn-gold text-base !py-3 !px-10">Contact Us</Link>
        </div>
      </section>
    </>
  )
}
