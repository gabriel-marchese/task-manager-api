const userService = require('../services/userService');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await userService.register({ name, email, password });

    return res.status(201).json({ message: 'Usuário criado com sucesso', user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { register };