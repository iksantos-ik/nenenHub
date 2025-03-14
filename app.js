const express = require('express');
// const {connectDB} = require('./db');
const rotaSala = require('./src/Rotas/SalaRota.js');
const openDb = require('./configDB.js');

const app = express();

openDb();

// connectDB();

app.use(express.json());
app.use('/salas', rotaSala);

const port = 8000;

// app.get('/', (req, res) => {
//     res.send('Bem vindo ao Nenen Hub!');
// });

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
