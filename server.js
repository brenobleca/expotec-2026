const express = require('express');
const mysql = require('mysql2'); // Importa o conector
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 4000;
const dotenv = require('dotenv');
dotenv.config();

const key=process.env.key;
// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.db_password,
    database: 'bd_expotec'
});

db.connect((err) => {
    if (err) {
        console.error('Erro na conexão com o banco de dados:', err.stack);
        return;
    }
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
});

// Middleware para CORS
app.use(cors());
// Middleware para entender JSON
app.use(express.json());

app.post('/api/registrar', (req, res) => {
    const { nome, data_nasc, email, senha, usuario, cpf } = req.body;

    if (!nome || !data_nasc || !email || !senha || !usuario || !cpf) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
    }

    // Verifica se o e-mail já existe
    db.query('SELECT email FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Erro ao verificar e-mail:', err);
            return res.status(500).json({ mensagem: 'Erro ao registrar usuário.' });
        }
        if (results.length > 0) {
            return res.status(409).json({ mensagem: 'Este e-mail já está em uso.' });
        }

        // Criptografa a senha antes de salvar
        bcrypt.hash(senha, 10, (err, senhaHash) => {
            if (err) {
                console.error('Erro ao criptografar senha:', err);
                return res.status(500).json({ mensagem: 'Erro ao registrar usuário.' });
            }
            const query = 'INSERT INTO usuarios (nome, data_nasc, email, senha, usuario, cpf) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [nome, data_nasc, email, senhaHash, usuario, cpf];
            db.query(query, values, (err, result) => {
                if (err) {
                    console.error('Erro ao registrar usuário:', err);
                    return res.status(500).json({ mensagem: 'Erro ao registrar usuário.' });
                }
                res.json({ mensagem: 'Registro realizado com sucesso!', sucesso: true });
            });
        });
    });
});


// Middleware para verificar JWT
function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, mensagem: 'Token não fornecido.' });
    jwt.verify(token, key || 'segredo', function(err, decoded) {
        if (err) return res.status(500).json({ auth: false, mensagem: 'Falha ao autenticar o token.' });
        req.userId = decoded.id;
        next();
    });
}

app.post('/api/login', (req, res) => {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
    }
    db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ mensagem: 'Erro ao realizar login.' });
        }
        if (results.length === 0) {
            return res.status(401).json({ mensagem: 'Usuário ou senha inválidos.' });
        }
        const user = results[0];
        bcrypt.compare(senha, user.senha, (err, isMatch) => {
            if (err) {
                console.error('Erro ao comparar senha:', err);
                return res.status(500).json({ mensagem: 'Erro ao realizar login.' });
            }
            if (!isMatch) {
                return res.status(401).json({ mensagem: 'Usuário ou senha inválidos.' });
            }
            // Gera o token JWT
            const token = jwt.sign({ id: user.id, usuario: user.usuario }, key || process.env.key, { expiresIn: 3600 });
            res.json({ mensagem: 'Login realizado com sucesso!', auth: true, token });
        });
    });
});

// Exemplo de rota protegida
app.post('/api/protegida', verifyJWT, (req, res) => {
    res.json({ mensagem: 'Acesso autorizado!', userId: req.userId });
});
// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});