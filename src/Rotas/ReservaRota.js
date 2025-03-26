const {Router} = require('express');
const ReservaController = require ('../Controladores/ReservaController.js');


const reservaController = new ReservaController();


const router = Router();

router.get('/', (req, res) => reservaController.listarReservas(req,res));
router.get('/reservadas/:salaId', (req, res) => reservaController.listarReservasSala(req,res));
router.get('/aprovadas', (req, res) => reservaController.listaDeReservasAprovadas(req,res));
router.get('/:id', (req, res) => reservaController.listarReservaPorId(req,res));
// router.get('/salas_sem_reserva', (req, res) => reservaController.listarSalasNaoReservadas(req,res));
// router.get('/salas_para_aprovar', (req, res) => reservaController.listaReservasParaAprovacao(req,res));
router.post('/', (req, res) => reservaController.criaReserva(req,res));
router.put('/aprovar/:id', (req, res) => reservaController.aprovarReserva(req,res));
router.put('/reprovar/:id', (req, res) => reservaController.reprovarReserva(req,res));
router.put('/editar/:id', (req, res) => reservaController.editarReserva(req,res));
router.put('/cancelar/:id', (req, res) => reservaController.cancelarReserva(req,res));
router.delete('/:id', (req, res) => reservaController.deletaReserva(req,res));


module.exports = router;