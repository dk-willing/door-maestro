import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiMail,
  HiCheckCircle,
  HiUserAdd,
  HiTrash,
  HiKey,
  HiX,
  HiEye,
  HiEyeOff,
  HiShieldCheck,
  HiCog,
} from "react-icons/hi";
import {
  fetchEmailSettings,
  saveEmailSettings,
  testEmail,
  changePassword,
  fetchEmployees,
  createEmployee,
  deleteEmployee,
  resetEmployeePassword,
} from "../api";
import toast from "react-hot-toast";

/* ─── tiny reusable atoms ─────────────────────────────────────── */

const Label = ({ children }) => (
  <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">
    {children}
  </p>
);

const Field = ({ label, children }) => (
  <div>
    <Label>{label}</Label>
    {children}
  </div>
);

const inputBase =
  "w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition-all duration-200";

const GoldBtn = ({ children, className = "", ...p }) => (
  <button
    {...p}
    className={`relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
      bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-900
      shadow-[0_0_20px_rgba(251,191,36,0.25)] hover:shadow-[0_0_30px_rgba(251,191,36,0.4)]
      disabled:opacity-40 disabled:cursor-not-allowed
      transition-all duration-200 active:scale-[0.98] ${className}`}
  >
    {children}
  </button>
);

const GhostBtn = ({ children, className = "", ...p }) => (
  <button
    {...p}
    className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
      border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100
      disabled:opacity-40 disabled:cursor-not-allowed
      transition-all duration-200 active:scale-[0.98] ${className}`}
  >
    {children}
  </button>
);

/* section card */
const Card = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm p-7 overflow-hidden"
  >
    {/* subtle corner glow */}
    <div className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-amber-500/5 blur-2xl" />
    {children}
  </motion.div>
);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-4">
    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
      <Icon className="text-amber-400" size={20} />
    </div>
    <div>
      <h2 className="text-zinc-100 font-semibold text-base leading-tight">
        {title}
      </h2>
      <p className="text-zinc-500 text-xs mt-0.5">{subtitle}</p>
    </div>
  </div>
);

/* ─── modals ──────────────────────────────────────────────────── */

function Backdrop({ onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
      onClick={onClick}
    />
  );
}

function AddEmployeeModal({ onClose, onSave }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error("All fields required");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await createEmployee(form);
      toast.success(`Employee "${form.username}" created`);
      onSave();
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Backdrop onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-7 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-7">
            <div>
              <h3 className="text-zinc-100 font-semibold text-lg">
                New Employee
              </h3>
              <p className="text-zinc-500 text-xs mt-0.5">
                Create staff login credentials
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <HiX size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Username">
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="e.g. john_doe"
                className={inputBase}
              />
            </Field>

            <Field label="Password">
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Min. 6 characters"
                  className={`${inputBase} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {show ? <HiEyeOff size={17} /> : <HiEye size={17} />}
                </button>
              </div>
            </Field>

            <AnimatePresence>
              {form.username && form.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-1.5 overflow-hidden"
                >
                  <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                    Credentials Preview
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-xs">Username</span>
                    <span className="text-amber-300 text-xs font-mono font-medium">
                      {form.username}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-xs">Password</span>
                    <span className="text-amber-300 text-xs font-mono font-medium">
                      {form.password}
                    </span>
                  </div>
                  <p className="text-zinc-600 text-[11px] mt-2 pt-2 border-t border-zinc-800">
                    Share with employee to log in.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <GoldBtn type="submit" disabled={loading} className="w-full !py-3">
              {loading ? "Creating account…" : "Create Employee Account"}
            </GoldBtn>
          </form>
        </motion.div>
      </div>
    </>
  );
}

function ResetPasswordModal({ employee, onClose, onSave }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await resetEmployeePassword(employee._id, password);
      toast.success("Password reset successfully");
      onSave();
    } catch {
      toast.error("Failed to reset password");
    }
    setLoading(false);
  };

  return (
    <>
      <Backdrop onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-7 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-zinc-100 font-semibold">Reset Password</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <HiX size={18} />
            </button>
          </div>
          <p className="text-zinc-500 text-sm mb-6">
            New password for{" "}
            <span className="text-amber-400 font-medium">
              {employee.username}
            </span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password (min. 6 chars)"
                className={`${inputBase} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {show ? <HiEyeOff size={17} /> : <HiEye size={17} />}
              </button>
            </div>
            <GoldBtn type="submit" disabled={loading} className="w-full !py-3">
              {loading ? "Resetting…" : "Reset Password"}
            </GoldBtn>
          </form>
        </motion.div>
      </div>
    </>
  );
}

/* ─── main page ───────────────────────────────────────────────── */

export default function Settings() {
  const [email, setEmail] = useState({
    enabled: false,
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPass: "",
    fromEmail: "",
    recipientEmail: "",
  });
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [pw, setPw] = useState({ current: "", new: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [resetTarget, setResetTarget] = useState(null);

  const loadEmployees = () => {
    fetchEmployees()
      .then((data) =>
        setEmployees(
          Array.isArray(data) ? data : (data?.employees ?? data?.data ?? []),
        ),
      )
      .catch(() => setEmployees([]));
  };

  useEffect(() => {
    fetchEmailSettings()
      .then(setEmail)
      .catch(() => {});
    loadEmployees();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveEmailSettings(email);
      toast.success("Email settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
    setSaving(false);
  };

  const handleTest = async () => {
    if (
      !email.smtpHost ||
      !email.smtpUser ||
      !email.smtpPass ||
      !email.recipientEmail
    ) {
      toast.error("Please fill in all SMTP fields and recipient email");
      return;
    }
    setTesting(true);
    try {
      await testEmail(email);
      toast.success("Test email sent!");
    } catch (err) {
      toast.error(err.message);
    }
    setTesting(false);
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pw.new !== pw.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (pw.new.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setPwLoading(true);
    try {
      await changePassword(pw.current, pw.new);
      toast.success("Password updated");
      setPw({ current: "", new: "", confirm: "" });
    } catch (err) {
      toast.error(err.message);
    }
    setPwLoading(false);
  };

  const handleDeleteEmployee = async (id, username) => {
    if (!confirm(`Remove employee "${username}"?`)) return;
    await deleteEmployee(id);
    toast.success("Employee removed");
    loadEmployees();
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* page title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <HiCog className="text-amber-400" size={22} />
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
            Settings
          </h1>
        </div>
        <p className="text-zinc-500 text-sm pl-9">
          Manage your account, team, and notifications
        </p>
      </motion.div>

      {/* ── Employee Accounts ── */}
      <Card delay={0.05}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <SectionHeader
            icon={HiUserAdd}
            title="Employee Accounts"
            subtitle="Manage staff login access"
          />
          <GoldBtn
            onClick={() => setShowAddEmployee(true)}
            className="w-full sm:w-auto sm:shrink-0 sm:self-start"
          >
            <HiUserAdd size={15} /> Add Employee
          </GoldBtn>
        </div>

        {employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-zinc-800/60 flex items-center justify-center mb-3">
              <HiUserAdd className="text-zinc-600" size={22} />
            </div>
            <p className="text-zinc-500 text-sm">No employees added yet</p>
            <p className="text-zinc-600 text-xs mt-1">
              Click "Add Employee" to get started
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {employees.map((emp, i) => (
              <motion.div
                key={emp._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-3.5 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold uppercase">
                    {emp.username[0]}
                  </div>
                  <div>
                    <p className="text-zinc-200 text-sm font-medium">
                      {emp.username}
                    </p>
                    <p className="text-zinc-600 text-xs">
                      Added{" "}
                      {new Date(emp.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setResetTarget(emp)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium hover:bg-blue-500/20 transition-colors cursor-pointer"
                  >
                    <HiKey size={13} /> Reset
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(emp._id, emp.username)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium hover:bg-red-500/20 transition-colors cursor-pointer"
                  >
                    <HiTrash size={13} /> Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* ── Email Notifications ── */}
      <Card delay={0.1}>
        <div className="mb-6">
          <SectionHeader
            icon={HiMail}
            title="Email Notifications"
            subtitle="Receive alerts when new orders are placed"
          />
        </div>

        {/* toggle */}
        <label className="flex items-center gap-3 cursor-pointer mb-2 w-fit">
          <button
            type="button"
            role="switch"
            aria-checked={email.enabled}
            onClick={() => setEmail({ ...email, enabled: !email.enabled })}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none ${email.enabled ? "bg-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.4)]" : "bg-zinc-700"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${email.enabled ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
          <span className="text-zinc-300 text-sm font-medium">
            Enable email notifications
          </span>
        </label>

        <AnimatePresence>
          {email.enabled ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-5 border-t border-zinc-800 mt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="SMTP Host">
                    <input
                      value={email.smtpHost}
                      onChange={(e) =>
                        setEmail({ ...email, smtpHost: e.target.value })
                      }
                      placeholder="smtp.gmail.com"
                      className={inputBase}
                    />
                  </Field>
                  <Field label="SMTP Port">
                    <input
                      value={email.smtpPort}
                      onChange={(e) =>
                        setEmail({ ...email, smtpPort: e.target.value })
                      }
                      placeholder="587"
                      className={inputBase}
                    />
                  </Field>
                </div>
                <Field label="SMTP Username">
                  <input
                    value={email.smtpUser}
                    onChange={(e) =>
                      setEmail({ ...email, smtpUser: e.target.value })
                    }
                    placeholder="your@email.com"
                    className={inputBase}
                  />
                </Field>
                <Field label="SMTP Password">
                  <input
                    type="password"
                    value={email.smtpPass}
                    onChange={(e) =>
                      setEmail({ ...email, smtpPass: e.target.value })
                    }
                    placeholder="App password or SMTP password"
                    className={inputBase}
                  />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="From Email">
                    <input
                      value={email.fromEmail}
                      onChange={(e) =>
                        setEmail({ ...email, fromEmail: e.target.value })
                      }
                      placeholder="noreply@yourapp.com"
                      className={inputBase}
                    />
                  </Field>
                  <Field label="Recipient Email">
                    <input
                      value={email.recipientEmail}
                      onChange={(e) =>
                        setEmail({ ...email, recipientEmail: e.target.value })
                      }
                      placeholder="admin@yourapp.com"
                      className={inputBase}
                    />
                  </Field>
                </div>
                <div className="flex gap-3 pt-1">
                  <GoldBtn onClick={handleSave} disabled={saving}>
                    {saving ? "Saving…" : "Save Settings"}
                  </GoldBtn>
                  <GhostBtn onClick={handleTest} disabled={testing}>
                    {testing ? (
                      "Sending…"
                    ) : (
                      <>
                        <HiCheckCircle size={15} /> Send Test
                      </>
                    )}
                  </GhostBtn>
                </div>
              </div>
            </motion.div>
          ) : (
            <p className="text-zinc-600 text-sm mt-3">
              Enable to configure SMTP and receive order notifications.
            </p>
          )}
        </AnimatePresence>
      </Card>

      {/* ── Change Password ── */}
      <Card delay={0.15}>
        <div className="mb-6">
          <SectionHeader
            icon={HiShieldCheck}
            title="Change Password"
            subtitle="Update your admin account password"
          />
        </div>

        <form onSubmit={handlePassword} className="space-y-4 max-w-sm">
          <Field label="Current Password">
            <input
              type="password"
              value={pw.current}
              onChange={(e) => setPw({ ...pw, current: e.target.value })}
              placeholder="••••••••"
              className={inputBase}
            />
          </Field>
          <Field label="New Password">
            <input
              type="password"
              value={pw.new}
              onChange={(e) => setPw({ ...pw, new: e.target.value })}
              placeholder="••••••••"
              className={inputBase}
            />
          </Field>
          <Field label="Confirm New Password">
            <input
              type="password"
              value={pw.confirm}
              onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
              placeholder="••••••••"
              className={inputBase}
            />
          </Field>

          {/* strength hint */}
          {pw.new && (
            <div className="flex gap-1.5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    pw.new.length > i * 3
                      ? pw.new.length < 6
                        ? "bg-red-500"
                        : pw.new.length < 10
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      : "bg-zinc-800"
                  }`}
                />
              ))}
            </div>
          )}

          <GoldBtn type="submit" disabled={pwLoading}>
            {pwLoading ? "Updating…" : "Update Password"}
          </GoldBtn>
        </form>
      </Card>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showAddEmployee && (
          <AddEmployeeModal
            onClose={() => setShowAddEmployee(false)}
            onSave={() => {
              setShowAddEmployee(false);
              loadEmployees();
            }}
          />
        )}
        {resetTarget && (
          <ResetPasswordModal
            employee={resetTarget}
            onClose={() => setResetTarget(null)}
            onSave={() => {
              setResetTarget(null);
              loadEmployees();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
