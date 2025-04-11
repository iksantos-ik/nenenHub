const {Router} = require('express');
const ReservaController = require ('../Controladores/ReservaController.js');
const autenticaToken = require('../Middleware/autentica.js');
const autorizaRoles = require('../Middleware/autorizaRole.js');


const reservaController = new ReservaController();


const router = Router();

router.get('/', autenticaToken, (req, res) => reservaController.listarReservas(req,res));
router.get('/filtro', autenticaToken, (req, res) => reservaController.listagemReservaPorFiltro(req,res));
router.get('/reservadas/:salaId', autenticaToken, (req, res) => reservaController.listarReservasSala(req,res));
router.get('/aprovadas', (req, res) => reservaController.listaDeReservasAprovadas(req,res));
router.get('/:id', autenticaToken, (req, res) => reservaController.listarReservaPorId(req,res));
router.post('/', autenticaToken, (req, res) => reservaController.criaReserva(req,res));
router.put('/aprovar/:id', autenticaToken, autorizaRoles('ADMIN'), (req, res) => reservaController.aprovarReserva(req,res));
router.put('/reprovar/:id', autenticaToken, autorizaRoles('ADMIN'), (req, res) => reservaController.reprovarReserva(req,res));
router.put('/editar/:id', autenticaToken, (req, res) => reservaController.editarReserva(req,res));
router.put('/cancelar/:id', autenticaToken, (req, res) => reservaController.cancelarReserva(req,res));
router.delete('/:id', autenticaToken, (req, res) => reservaController.deletaReserva(req,res));


module.exports = router;