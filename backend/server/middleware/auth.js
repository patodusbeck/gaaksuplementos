const jwt = require("jsonwebtoken");
const { getJwtSecret } = require("../config/env");

const getTokenFromRequest = (req) => {
  const header = String(req.headers.authorization || "");
  if (!header.toLowerCase().startsWith("bearer ")) return "";
  return header.slice(7).trim();
};

const requireAuth = (roles = []) => (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) return res.status(401).json({ error: "Nao autenticado" });

  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.auth = payload;

    if (roles.length > 0 && !roles.includes(payload.role)) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Sessao invalida ou expirada" });
  }
};

module.exports = { requireAuth };
