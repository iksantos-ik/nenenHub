const {Router} = require('express');
const SalaController = require ('../Controladores/SalaController');
const autenticaToken = require('../Middleware/autentica.js');
const autorizaRoles = require('../Middleware/autorizaRole.js');



const salaController = new SalaController();


const router = Router();

router.get('/', autenticaToken, (req, res) => salaController.listarSalas(req,res));
router.get('/filtro', autenticaToken, autorizaRoles('ADMIN'), (req, res) => salaController.listagemSalaPorFiltro(req,res));
router.get('/capacidade/:capacidade', autenticaToken, autorizaRoles('ADMIN'), (req, res) => salaController.listarSalasPorCapacidade(req,res));
router.get('/ativa', autenticaToken, autorizaRoles('ADMIN'), (req, res) => salaController.listarSalasAtivas(req,res));
router.get('/:id', autenticaToken, autorizaRoles('ADMIN'), (req, res) => salaController.listarSalaPorId(req,res));
router.post('/', autenticaToken, autorizaRoles('ADMIN'), (req, res) => salaController.cadastraSala(req,res));
router.put('/inativar/:id', autenticaToken, autorizaRoles('ADMIN'), (req, res) => salaController.inativarSala(req,res));
router.put('/ativar/:id', autenticaToken, autorizaRoles('ADMIN'), (req, res) => salaController.ativarSala(req,res));
router.put('/editar/:id', autenticaToken, autorizaRoles('ADMIN'), (req, res) => salaController.editarSala(req,res));
router.delete('/:id', autenticaToken, autorizaRoles('ADMIN'), (req, res) => salaController.deletarSala(req,res));


module.exports = router;

