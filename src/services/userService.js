const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async ({ name, email, password }) => {
  // Verifica se o email já existe
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  // Criptografa a senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Cria o usuário
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Remove a senha da resposta
  const userWithoutPassword = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  };

  return userWithoutPassword;
};

const login = async ({email, password}) => {

  if (!email || !password) {
    throw new Error('O Campo de Email e Senha são Obrigatórios');
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    throw new Error('Formato de email inválido');
  }

  const existingUser = await User.findOne({ where: { email } });
  if (!existingUser) {
    throw new Error('Email não Cadastrado');
  }
  
  const passwordUser = await bcrypt.compare(password, existingUser.password);
  if(!passwordUser) {
    throw new Error('Senha inválida');
  }

  const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  return {
    token,
    existingUser: {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
    },
  };
};

module.exports = { register, login };