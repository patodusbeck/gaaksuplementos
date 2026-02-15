const bcrypt = require("bcryptjs");
const AdminUser = require("../models/AdminUser");

let seeded = false;

const ensureDefaultAdmins = async () => {
  if (seeded) return;

  const ownerPassword = String(process.env.OWNER_PASSWORD || "Owner@123").trim();
  const managerPassword = String(process.env.MANAGER_PASSWORD || "Gerente@123").trim();

  const users = [
    { username: "owner", role: "owner", password: ownerPassword },
    { username: "gerente", role: "gerente", password: managerPassword },
  ];

  for (const user of users) {
    const existing = await AdminUser.findOne({ username: user.username });
    if (!existing) {
      const passwordHash = await bcrypt.hash(user.password, 12);
      await AdminUser.create({
        username: user.username,
        role: user.role,
        passwordHash,
        active: true,
      });
    }
  }

  seeded = true;
};

module.exports = { ensureDefaultAdmins };
