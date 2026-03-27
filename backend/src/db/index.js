const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ─── Schemas ────────────────────────────────────────────────────────────────

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    material: String,
    size: String,
    country: String,
    stock: { type: Number, default: 0 },
    images: { type: [String], default: [] },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

const orderSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    product_name: String,
    quantity: { type: Number, required: true },
    customer_name: { type: String, required: true },
    phone: { type: String, required: true },
    note: String,
    status: { type: String, default: "pending" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
});

// ─── Models ─────────────────────────────────────────────────────────────────

const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Setting = mongoose.model("Setting", settingSchema);

// ─── Init ────────────────────────────────────────────────────────────────────

async function initDb({
  mongoUri,
  defaultAdminUsername,
  defaultAdminPassword,
}) {
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  const existingAdmin = await Admin.findOne();
  if (!existingAdmin) {
    const hash = await bcrypt.hash(defaultAdminPassword, 10);
    await Admin.create({ username: defaultAdminUsername, password: hash });
    console.log(
      `Default admin created - username: ${defaultAdminUsername}, password: ${defaultAdminPassword}`,
    );
  }
}

const employeeSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "employee" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = { initDb, Product, Order, Admin, Setting, Employee };
