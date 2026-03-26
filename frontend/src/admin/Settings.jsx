import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiMail, HiCheckCircle } from 'react-icons/hi'
import { fetchEmailSettings, saveEmailSettings, testEmail, changePassword } from '../api'
import toast from 'react-hot-toast'

export default function Settings() {
  const [email, setEmail] = useState({
    enabled: false,
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    fromEmail: '',
    recipientEmail: '',
  })
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [pw, setPw] = useState({ current: '', new: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)

  useEffect(() => {
    fetchEmailSettings().then(setEmail).catch(() => {})
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveEmailSettings(email)
      toast.success('Email settings saved')
    } catch { toast.error('Failed to save settings') }
    setSaving(false)
  }

  const handleTest = async () => {
    if (!email.smtpHost || !email.smtpUser || !email.smtpPass || !email.recipientEmail) {
      toast.error('Please fill in all SMTP fields and recipient email')
      return
    }
    setTesting(true)
    try {
      await testEmail(email)
      toast.success('Test email sent successfully!')
    } catch (err) { toast.error(err.message) }
    setTesting(false)
  }

  const handlePassword = async (e) => {
    e.preventDefault()
    if (pw.new !== pw.confirm) { toast.error('Passwords do not match'); return }
    if (pw.new.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setPwLoading(true)
    try {
      await changePassword(pw.current, pw.new)
      toast.success('Password updated')
      setPw({ current: '', new: '', confirm: '' })
    } catch (err) { toast.error(err.message) }
    setPwLoading(false)
  }

  const inputClass = 'w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text text-sm outline-none focus:border-gold transition-colors'

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Email Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
            <HiMail className="text-gold" size={22} />
          </div>
          <div>
            <h2 className="text-dark-text font-semibold">Email Notifications</h2>
            <p className="text-dark-muted text-xs">Receive email alerts when new orders are placed</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setEmail({ ...email, enabled: !email.enabled })}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${email.enabled ? 'bg-gold' : 'bg-dark-border'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${email.enabled ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-dark-text text-sm font-medium">Enable email notifications</span>
          </label>

          {email.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 pt-2"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-dark-muted text-xs font-medium mb-1.5 block">SMTP Host</label>
                  <input value={email.smtpHost} onChange={e => setEmail({ ...email, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com" className={inputClass} />
                </div>
                <div>
                  <label className="text-dark-muted text-xs font-medium mb-1.5 block">SMTP Port</label>
                  <input value={email.smtpPort} onChange={e => setEmail({ ...email, smtpPort: e.target.value })}
                    placeholder="587" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="text-dark-muted text-xs font-medium mb-1.5 block">SMTP Username</label>
                <input value={email.smtpUser} onChange={e => setEmail({ ...email, smtpUser: e.target.value })}
                  placeholder="your@email.com" className={inputClass} />
              </div>
              <div>
                <label className="text-dark-muted text-xs font-medium mb-1.5 block">SMTP Password</label>
                <input type="password" value={email.smtpPass} onChange={e => setEmail({ ...email, smtpPass: e.target.value })}
                  placeholder="App password or SMTP password" className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-dark-muted text-xs font-medium mb-1.5 block">From Email</label>
                  <input value={email.fromEmail} onChange={e => setEmail({ ...email, fromEmail: e.target.value })}
                    placeholder="noreply@doormaestro.com" className={inputClass} />
                </div>
                <div>
                  <label className="text-dark-muted text-xs font-medium mb-1.5 block">Recipient Email</label>
                  <input value={email.recipientEmail} onChange={e => setEmail({ ...email, recipientEmail: e.target.value })}
                    placeholder="admin@doormaestro.com" className={inputClass} />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="btn-gold !py-2.5 !px-6 text-sm">
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
                <button onClick={handleTest} disabled={testing}
                  className="btn-outline !py-2.5 !px-6 text-sm flex items-center gap-2">
                  {testing ? 'Sending...' : <><HiCheckCircle size={16} /> Send Test Email</>}
                </button>
              </div>
            </motion.div>
          )}

          {!email.enabled && (
            <p className="text-dark-muted text-sm">Enable to configure SMTP settings and receive order notifications.</p>
          )}
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <h2 className="text-dark-text font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePassword} className="space-y-4 max-w-sm">
          <div>
            <label className="text-dark-muted text-xs font-medium mb-1.5 block">Current Password</label>
            <input type="password" value={pw.current} onChange={e => setPw({ ...pw, current: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="text-dark-muted text-xs font-medium mb-1.5 block">New Password</label>
            <input type="password" value={pw.new} onChange={e => setPw({ ...pw, new: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="text-dark-muted text-xs font-medium mb-1.5 block">Confirm New Password</label>
            <input type="password" value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })} className={inputClass} />
          </div>
          <button type="submit" disabled={pwLoading} className="btn-gold !py-2.5 !px-6 text-sm">
            {pwLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
