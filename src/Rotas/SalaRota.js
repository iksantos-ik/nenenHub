const {Router} = require('express');
const SalaController = require ('../Controladores/SalaController');
//const salasModel = require('../database/models/sala');

// const salasModel = require('../Modelos/salasModel');

const salaController = new SalaController();


const router = Router();

router.get('/', (req, res) => salaController.listarSalas(req,res));
router.get('/filtro', (req, res) => salaController.listagemSalaPorFiltro(req,res));
router.get('/capacidade/:capacidade', (req, res) => salaController.listarSalasPorCapacidade(req,res));
router.get('/ativa', (req, res) => salaController.listarSalasAtivas(req,res));
router.get('/:id', (req, res) => salaController.listarSalaPorId(req,res));
router.post('/', (req, res) => salaController.cadastraSala(req,res));
router.put('/inativar/:id', (req, res) => salaController.inativarSala(req,res));
router.put('/ativar/:id', (req, res) => salaController.ativarSala(req,res));
router.put('/editar/:id', (req, res) => salaController.editarSala(req,res));
router.delete('/:id', (req, res) => salaController.deletarSala(req,res));


module.exports = router;

