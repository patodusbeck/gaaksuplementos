const bcrypt = require("bcryptjs");
const AdminUser = require("../models/AdminUser");

let seeded = false;

const ensureDefaultAdmins = async () => {
  if (seeded) return;

  const adminPassword = String(process.env.ADMIN_PASSWORD || process.env.OWNER_PASSWORD || "Owner@123").trim();
  const managerPassword = String(process.env.MANAGER_PASSWORD || "Gerente@123").trim();

  let admin = await AdminUser.findOne({ username: "admin" });
  if (!admin) {
    const adminHash = await bcrypt.hash(adminPassword, 12);
    admin = await AdminUser.create({
      username: "admin",
      role: "owner",
      passwordHash: adminHash,
      active: true,
    });
  } else {
    // Preserve senha existente; apenas corrige role/status se necessario.
    const needsUpdate = admin.role !== "owner" || admin.active !== true;
    if (needsUpdate) {
      admin.role = "owner";
      admin.active = true;
      await admin.save();
    }
  }

  let manager = await AdminUser.findOne({ username: "gerente" });
  if (!manager) {
    const managerHash = await bcrypt.hash(managerPassword, 12);
    manager = await AdminUser.create({
      username: "gerente",
      role: "gerente",
      passwordHash: managerHash,
      active: true,
    });
  } else {
    // Preserve senha existente; apenas corrige role/status se necessario.
    const needsUpdate = manager.role !== "gerente" || manager.active !== true;
    if (needsUpdate) {
      manager.role = "gerente";
      manager.active = true;
      await manager.save();
    }
  }

  const legacyOwner = await AdminUser.findOne({ username: "owner", active: true });
  if (legacyOwner) {
    legacyOwner.active = false;
    await legacyOwner.save();
  }

  seeded = true;
};

module.exports = { ensureDefaultAdmins };
