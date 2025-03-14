const {Router} = require('express');
const SalaController = require ('../Controladores/SalaController');
const salasModel = require('../database/models/sala');

// const salasModel = require('../Modelos/salasModel');

const salaController = new SalaController();


const router = Router();

router.get('/', (req, res) => salaController.listarSalas(req,res));
router.get('/:capacidade', (req, res) => salaController.listarSalasPorCapacidade(req,res));
router.post('/', (req, res) => salaController.cadastraSala(req,res));

module.exports = router;

