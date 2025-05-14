const bcrypt = require('bcrypt');
const User = require('../models/User');

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

module.exports = { register };