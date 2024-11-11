const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cors = require("cors");
const dbConfig = require("./mongoConnect");
const { User, Admin } = require("./models");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "sua_chave_secreta",
    resave: false,
    saveUninitialized: true,
  })
);

// Servir arquivos estáticos
app.use(express.static("public"));

// Rota para cadastro
app.post("/cadastrar", async (req, res) => {
  try {
    const { nome, telefone, email } = req.body;
    const user = new User({ nome, telefone, email });
    console.log("user", user);
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Erro ao cadastrar usuário" });
  }
});

// Rota para cadastro de admin
app.post("/admin/cadastrar", async (req, res) => {
  const { password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newAdmin = new Admin({
    ...req.body,
    password: hashedPassword,
  });

  try {
    await newAdmin.save();
    return res.status(201).json("Administrador registrado com sucesso");
  } catch (error) {
    return res.status(400).json(error);
  }
});

// Rota para login de admin
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email: email });
    const passwordOk = admin && bcrypt.compare(password, admin.password);

    if (passwordOk) return res.status(200).json(admin);
    return res.status(400).json({ error });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// Rota para listar usuários
app.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
