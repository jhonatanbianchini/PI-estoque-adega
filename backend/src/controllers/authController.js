const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {

  try {

    const { usuario, senha, chave } = req.body;

    const userExists = await pool.query(
      "SELECT * FROM users WHERE usuario = $1",
      [usuario]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        message: "Usuário já existe"
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.query(
      "INSERT INTO users (usuario, senha, chave) VALUES ($1, $2, $3)",
      [usuario, senhaHash, chave]
    );

    res.status(201).json({
      message: "Usuário cadastrado com sucesso"
    });

  } catch (error) {
    res.status(500).json(error);
  }

};

exports.login = async (req, res) => {

  try {

    const { usuario, senha, chave } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE usuario = $1",
      [usuario]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "Usuário não encontrado"
      });
    }

    const usuarioBanco = user.rows[0];

    const senhaValida = await bcrypt.compare(
      senha,
      usuarioBanco.senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        message: "Senha inválida"
      });
    }

    if (usuarioBanco.chave !== chave) {
      return res.status(401).json({
        message: "Chave inválida"
      });
    }

    const token = jwt.sign(
      {
        id: usuarioBanco.id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      token
    });

  } catch (error) {
    res.status(500).json(error);
  }

};
exports.resetPassword = async (req, res) => {

  try {

    const { usuario, chave, novaSenha } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE usuario = $1",
      [usuario]
    );

    if(result.rows.length === 0){
      return res.status(404).json({
        message:"Usuário não encontrado"
      });
    }

    const user = result.rows[0];

    if(user.chave !== chave){
      return res.status(401).json({
        message:"Chave inválida"
      });
    }

    const senhaHash = await bcrypt.hash(
      novaSenha,
      10
    );

    await pool.query(
      "UPDATE users SET senha = $1 WHERE id = $2",
      [senhaHash, user.id]
    );

    res.json({
      message:"Senha alterada"
    });

  } catch (error) {
    res.status(500).json(error);
  }

};