const bcrypt = require("bcryptjs");
const AdminUser = require("../models/AdminUser");

let seeded = false;

const ensureDefaultAdmins = async () => {
  if (seeded) return;

  const adminPassword = String(process.env.ADMIN_PASSWORD || process.env.OWNER_PASSWORD || "Owner@123").trim();
  const managerPassword = String(process.env.MANAGER_PASSWORD || "Gerente@123").trim();

  const adminHash = await bcrypt.hash(adminPassword, 12);
  const managerHash = await bcrypt.hash(managerPassword, 12);

  let admin = await AdminUser.findOne({ username: "admin" });
  if (!admin) {
    admin = await AdminUser.create({
      username: "admin",
      role: "owner",
      passwordHash: adminHash,
      active: true,
    });
  } else {
    admin.role = "owner";
    admin.passwordHash = adminHash;
    admin.active = true;
    await admin.save();
  }

  let manager = await AdminUser.findOne({ username: "gerente" });
  if (!manager) {
    manager = await AdminUser.create({
      username: "gerente",
      role: "gerente",
      passwordHash: managerHash,
      active: true,
    });
  } else {
    manager.role = "gerente";
    manager.passwordHash = managerHash;
    manager.active = true;
    await manager.save();
  }

  const legacyOwner = await AdminUser.findOne({ username: "owner", active: true });
  if (legacyOwner) {
    legacyOwner.active = false;
    await legacyOwner.save();
  }

  seeded = true;
};

module.exports = { ensureDefaultAdmins };
