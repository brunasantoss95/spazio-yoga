const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');

const cors = require('cors');
app.use(cors());
app.use(express.json());

const app = express();
const port = process.env.PORT || 3000;

// String de conexão do MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/spazio_yoga';

// Conectar ao MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Definir o modelo de Usuário
const User = mongoose.model('User', {
    nome: String,
    telefone: String,
    email: String,
    isAdmin: { type: Boolean, default: false }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'sua_chave_secreta',
    resave: false,
    saveUninitialized: true
}));

// Servir arquivos estáticos
app.use(express.static('public'));

// Rota para cadastro
app.post('/cadastrar', async (req, res) => {
  try {
    const { nome, telefone, email } = req.body;
    const user = new User({ nome, telefone, email });
    await user.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    res.status(500).json({ success: false, error: 'Erro ao cadastrar usuário' });
  }
});

// Rota para login de admin
app.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, isAdmin: true });
    if (admin && await bcrypt.compare(password, admin.password)) {
        req.session.adminId = admin._id;
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

// Rota protegida para listar usuários
app.get('/admin/users', async (req, res) => {
    if (!req.session.adminId) {
        return res.status(401).json({ error: 'Não autorizado' });
    }
    const users = await User.find({});
    res.json(users);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
})