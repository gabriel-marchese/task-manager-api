require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Conectando ao PostgreSQL com Sequelize");

        await sequelize.sync({alter: true});

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error("Erro ao conectar no banco", error);
    }
})();