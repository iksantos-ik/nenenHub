const {Router} = require ('express');
const UsuarioController = require('../Controladores/UsuarioController');
const autenticaToken = require('../Middleware/autentica.js');
const autorizaRoles = require('../Middleware/autorizaRole.js');

const usuarioController = new UsuarioController();

const router = Router();

router.get('/admin', autenticaToken, autorizaRoles('ADMIN'),  (req, res) => usuarioController.listarUsuarios(req,res));
router.get('/:id', autenticaToken, (req, res) => usuarioController.listarUsuariosPorId(req,res));
router.put('/:id/aprovar-user', autenticaToken, (req, res) => usuarioController.aprovarUsuarioUser(req,res));
router.put('/:id/aprovar-admin', autenticaToken,  (req, res) => usuarioController.aprovarUsuarioAdmin(req,res));
router.put('/:id/reprova-cadastro', autenticaToken, (req, res) => usuarioController.reprovarCadastro(req,res));
router.post('/',  (req, res) => usuarioController.cadastrarUsuario(req,res));
router.post('/login', (req, res) => usuarioController.loginUsuario(req,res));


module.exports = router;
