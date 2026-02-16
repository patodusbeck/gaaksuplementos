require("dotenv").config();
const app = require("./app");
const { validateStartupEnv } = require("./config/env");

validateStartupEnv();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
