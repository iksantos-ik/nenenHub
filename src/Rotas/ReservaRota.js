const {Router} = require('express');
const ReservaController = require ('../Controladores/ReservaController.js');


const reservaController = new ReservaController();


const router = Router();

router.get('/', (req, res) => reservaController.listarReservas(req,res));
router.get('/reservadas/:salaId', (req, res) => reservaController.listarReservasSala(req,res));
router.get('/salas_sem_reserva', (req, res) => reservaController.listarSalasNaoReservadas(req,res));
router.post('/', (req, res) => reservaController.criaReserva(req,res));
router.put('/aprovar/:id', (req, res) => reservaController.aprovarReserva(req,res));
router.put('/reprovar/:id', (req, res) => reservaController.reprovarReservaConflitante(req,res));
router.delete('/:id', (req, res) => reservaController.deletaReserva(req,res));


module.exports = router;