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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-dark-text font-semibold text-lg">
            Add New Employee
          </h3>
          <button
            onClick={onClose}
            className="text-dark-muted hover:text-dark-text bg-transparent border-none cursor-pointer"
          >
            <HiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-dark-muted text-xs font-medium mb-1.5 block">
              Username
            </label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="e.g. john_doe"
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="text-dark-muted text-xs font-medium mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters"
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 pr-11 text-dark-text text-sm outline-none focus:border-gold transition-colors"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text bg-transparent border-none cursor-pointer"
              >
                {show ? <HiEyeOff size={18} /> : <HiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Credentials preview */}
          {form.username && form.password && (
            <div className="bg-dark-surface border border-gold/20 rounded-lg p-4 space-y-1">
              <p className="text-gold text-xs font-semibold uppercase tracking-wide mb-2">
                Login Credentials
              </p>
              <p className="text-dark-text text-sm">
                Username:{" "}
                <span className="text-gold font-medium">{form.username}</span>
              </p>
              <p className="text-dark-text text-sm">
                Password:{" "}
                <span className="text-gold font-medium">{form.password}</span>
              </p>
              <p className="text-dark-muted text-xs mt-2">
                Share these with the employee to log in.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full !py-3 text-sm"
          >
            {loading ? "Creating..." : "Create Employee Account"}
          </button>
        </form>
      </motion.div>
    </div>
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-dark-text font-semibold">Reset Password</h3>
          <button
            onClick={onClose}
            className="text-dark-muted hover:text-dark-text bg-transparent border-none cursor-pointer"
          >
            <HiX size={20} />
          </button>
        </div>
        <p className="text-dark-muted text-sm mb-4">
          Setting new password for{" "}
          <span className="text-gold font-medium">{employee.username}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 pr-11 text-dark-text text-sm outline-none focus:border-gold transition-colors"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text bg-transparent border-none cursor-pointer"
            >
              {show ? <HiEyeOff size={18} /> : <HiEye size={18} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full !py-3 text-sm"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

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
      .then(setEmployees)
      .catch(() => {});
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
      toast.success("Test email sent successfully!");
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

  const inputClass =
    "w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text text-sm outline-none focus:border-gold transition-colors";

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Employee Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
              <HiUserAdd className="text-gold" size={22} />
            </div>
            <div>
              <h2 className="text-dark-text font-semibold">
                Employee Accounts
              </h2>
              <p className="text-dark-muted text-xs">
                Manage staff login access
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddEmployee(true)}
            className="btn-gold flex items-center gap-2 !py-2 !px-4 text-sm"
          >
            <HiUserAdd size={16} /> Add Employee
          </button>
        </div>

        {employees.length === 0 ? (
          <p className="text-dark-muted text-sm text-center py-6">
            No employees added yet.
          </p>
        ) : (
          <div className="space-y-3">
            {employees.map((emp) => (
              <div
                key={emp._id}
                className="flex items-center justify-between bg-dark-surface border border-dark-border rounded-lg px-4 py-3"
              >
                <div>
                  <p className="text-dark-text text-sm font-medium">
                    {emp.username}
                  </p>
                  <p className="text-dark-muted text-xs">
                    Added {new Date(emp.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setResetTarget(emp)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium cursor-pointer hover:bg-blue-500/20 transition-colors"
                  >
                    <HiKey size={14} /> Reset Password
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(emp._id, emp.username)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium cursor-pointer hover:bg-red-500/20 transition-colors"
                  >
                    <HiTrash size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Email Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
            <HiMail className="text-gold" size={22} />
          </div>
          <div>
            <h2 className="text-dark-text font-semibold">
              Email Notifications
            </h2>
            <p className="text-dark-muted text-xs">
              Receive email alerts when new orders are placed
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setEmail({ ...email, enabled: !email.enabled })}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${email.enabled ? "bg-gold" : "bg-dark-border"}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${email.enabled ? "translate-x-[22px]" : "translate-x-0.5"}`}
              />
            </div>
            <span className="text-dark-text text-sm font-medium">
              Enable email notifications
            </span>
          </label>

          {email.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4 pt-2"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-dark-muted text-xs font-medium mb-1.5 block">
                    SMTP Host
                  </label>
                  <input
                    value={email.smtpHost}
                    onChange={(e) =>
                      setEmail({ ...email, smtpHost: e.target.value })
                    }
                    placeholder="smtp.gmail.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-dark-muted text-xs font-medium mb-1.5 block">
                    SMTP Port
                  </label>
                  <input
                    value={email.smtpPort}
                    onChange={(e) =>
                      setEmail({ ...email, smtpPort: e.target.value })
                    }
                    placeholder="587"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="text-dark-muted text-xs font-medium mb-1.5 block">
                  SMTP Username
                </label>
                <input
                  value={email.smtpUser}
                  onChange={(e) =>
                    setEmail({ ...email, smtpUser: e.target.value })
                  }
                  placeholder="your@email.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-dark-muted text-xs font-medium mb-1.5 block">
                  SMTP Password
                </label>
                <input
                  type="password"
                  value={email.smtpPass}
                  onChange={(e) =>
                    setEmail({ ...email, smtpPass: e.target.value })
                  }
                  placeholder="App password or SMTP password"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-dark-muted text-xs font-medium mb-1.5 block">
                    From Email
                  </label>
                  <input
                    value={email.fromEmail}
                    onChange={(e) =>
                      setEmail({ ...email, fromEmail: e.target.value })
                    }
                    placeholder="noreply@doormaestro.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-dark-muted text-xs font-medium mb-1.5 block">
                    Recipient Email
                  </label>
                  <input
                    value={email.recipientEmail}
                    onChange={(e) =>
                      setEmail({ ...email, recipientEmail: e.target.value })
                    }
                    placeholder="admin@doormaestro.com"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-gold !py-2.5 !px-6 text-sm"
                >
                  {saving ? "Saving..." : "Save Settings"}
                </button>
                <button
                  onClick={handleTest}
                  disabled={testing}
                  className="btn-outline !py-2.5 !px-6 text-sm flex items-center gap-2"
                >
                  {testing ? (
                    "Sending..."
                  ) : (
                    <>
                      <HiCheckCircle size={16} /> Send Test Email
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
          {!email.enabled && (
            <p className="text-dark-muted text-sm">
              Enable to configure SMTP settings and receive order notifications.
            </p>
          )}
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <h2 className="text-dark-text font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePassword} className="space-y-4 max-w-sm">
          <div>
            <label className="text-dark-muted text-xs font-medium mb-1.5 block">
              Current Password
            </label>
            <input
              type="password"
              value={pw.current}
              onChange={(e) => setPw({ ...pw, current: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-dark-muted text-xs font-medium mb-1.5 block">
              New Password
            </label>
            <input
              type="password"
              value={pw.new}
              onChange={(e) => setPw({ ...pw, new: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-dark-muted text-xs font-medium mb-1.5 block">
              Confirm New Password
            </label>
            <input
              type="password"
              value={pw.confirm}
              onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={pwLoading}
            className="btn-gold !py-2.5 !px-6 text-sm"
          >
            {pwLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </motion.div>

      {/* Modals */}
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
