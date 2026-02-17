const getJwtSecret = () => {
  const secret = String(process.env.JWT_SECRET || "").trim();
  if (!secret) {
    throw new Error("JWT_SECRET nao definido nas variaveis de ambiente");
  }
  return secret;
};

const validateStartupEnv = () => {
  getJwtSecret();
};

module.exports = { getJwtSecret, validateStartupEnv };
