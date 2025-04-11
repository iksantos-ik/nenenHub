const UsuarioService = require ('../Servicos/UsuarioService');

class UsuarioController{
    constructor(){
        this.UsuarioService = new UsuarioService;
    }

    async listarUsuarios(req,res){
        const usuarios = await this.UsuarioService.listarTodosUsuarios();
        res.status(200).send(usuarios);
    }
    async listarUsuariosPorId(req,res){
        const {id} = req.params;
        const usuarioId = await this.UsuarioService.pegaUmRegistroPorId(id);
        res.status(200).send(usuarioId);
    }
    async cadastrarUsuario (req, res){
        try {
            const {nome, email, senha} = req.body;
            const novoUsuario = await this.UsuarioService.cadastraUsuario(nome, email, senha)
            res.status(201).send(novoUsuario);
        } catch (error) {
            res.status(400).send({message: error.message});            
        }
    }
    async loginUsuario(req,res){
        try {
            const {email, senha} = req.body;
            const novoLogin = await this.UsuarioService.login(email, senha);
            res.status(200).send(novoLogin);
        } catch (error) {
            res.status(400).send({message: error.message}); 
        }

    }
    async aprovarUsuarioUser(req,res){
        try {
            const {id} = req.params;
            const usuarioUser = await this.UsuarioService.aprovaComoUser(Number(id));
            res.send(usuarioUser);         
        } catch (error) {
            res.status(500)
            res.send(error.message)              
        }
    }
    async aprovarUsuarioAdmin(req,res){
        try {
            const {id} = req.params;
            const usuarioAdmin = await this.UsuarioService.aprovaComoAdmin(Number(id));
            res.send(usuarioAdmin);         
        } catch (error) {
            res.status(500)
            res.send(error.message)              
        }
    }async reprovarCadastro(req,res){
        try {
            const {id} = req.params;
            const usuarioReprovado = await this.UsuarioService.reprovaCadastro(Number(id));
            res.send(usuarioReprovado);         
        } catch (error) {
            res.status(500)
            res.send(error.message)              
        }
    }
}

module.exports = UsuarioController;