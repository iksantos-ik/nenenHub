const express = require('express');
const rotaSala = require('./src/Rotas/SalaRota.js');
const rotaReserva = require('./src/Rotas/ReservaRota.js')
const cors = require("cors");


const app = express();
// Permitir todas as origens (pode ser mais restritivo, se necessário)
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());
app.use('/salas', rotaSala);
app.use('/reservas', rotaReserva);


const port = 8000;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
