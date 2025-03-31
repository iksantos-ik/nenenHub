//const {mostraSalas, mostraSalasPorCapacidade, insereSala} = require('../Servicos/salas');
const SalaService = require('../Servicos/SalaService')

class SalaController {
    constructor (){
      this.salaService =  new SalaService();
    }

    async listarSalas(req, res) {
        try {
            const salas = await this.salaService.pegaTodosOsRegistros();
            res.send(salas);        
        } catch (error) {
            res.status(500)
            res.send(error.message)        
        }
    }

    async listarSalasPorCapacidade(req, res) {
        try {
            const numCapacidade = Number(req.params.capacidade);
            if(isNaN(numCapacidade)){
                return res.status(400).send("A capacidade deve ser um número válido.");
            }
            const salaCapacidade = await this.salaService.pegaUmRegistroPorCapacidade(numCapacidade);
            if (numCapacidade === 0){
                res.status(422)
                res.send("Infelizmente não temos sala para essa capacidade!")
            }
            res.send(salaCapacidade);
            
        } catch (error) {
            res.status(500)
            res.send(error.message)       
        }
    }
    async listarSalasAtivas(req, res) {
        try {
            const salaAtiva = await this.salaService.pegaRegistrosAtivos();
            console.log(salaAtiva);
            if (salaAtiva.lenght === 0){
                res.status(422)
                res.send("Não temos salas ativas")
            }
            res.send(salaAtiva);
            } catch (error) {
            res.status(500)
            res.send(error.message)       
        }
    }
    async listarSalaPorId(req, res) {
        try {
            const {id} = req.params;
            const sala = await this.salaService.pegaUmRegistroPorId(id);
            res.send(sala);        
        } catch (error) {
            res.status(500)
            res.send(error.message)        
        }
    }
    async listagemSalaPorFiltro(req, res) {
        try {
            const {nome, capacidade, ativa} = req.query;
            const salas = await this.salaService.listarSalaPorFiltros(nome, capacidade, ativa);
            res.send(salas);        
        } catch (error) {
            res.status(500)
            res.send(error.message)        
        }
    }


    


    async cadastraSala(req, res) {
        try {
            const salanova = req.body;
            if(!req.body.capacidade){
                res.status(400)
                return res.send('É obrigatório informar a capacidade da sala')             
            } 
            if (!req.body.nome){
                res.status(400)
                return res.send('É obrigatório informar o nome da sala') 
            }
            if(await this.salaService.isNomeSalaUsado(req.body.nome)){
                res.status(400)
                return res.send('O nome da sala já está sendo usado') 
            }
            const salaCriada = await this.salaService.criaRegistro(salanova)
            res.status(201)
            return res.send('Sala cadastrada com sucesso') 
        } catch (error) {
            res.status(500)
            return res.send(error.message)   
        }        
    }
    async inativarSala(req,res){
        try {
            const salaParaInativar = Number(req.params.id)
            if(salaParaInativar.reservada){
                res.status(400)
                return res.send('A sala não pode ser inativada pois está reservada')
            }
            const salaInativada = await this.salaService.salaInativar(salaParaInativar)     
            res.status(201)
            return res.send(`A sala ${salaParaInativar} foi inativada.`) 
        } catch (error) {
            res.status(500)
            return res.send(error.message)   
        }
    }
    async ativarSala(req,res){
        try {
            const salaParaAtivar = Number(req.params.id)
            const salaAtivada = await this.salaService.salaAtivar(salaParaAtivar)     
            res.status(201)
            return res.send(`A sala ${salaParaAtivar} foi Ativada.`) 
        } catch (error) {
            res.status(500)
            return res.send(error.message)   
        }
    }
    async editarSala(req,res){
        try {
            const {id} = req.params;
            const salaParaEditar = req.body;
            const salaEditada = await this.salaService.atualizaRegistro(Number(id), salaParaEditar)     
            res.status(201)
            return res.send(`A sala ${salaParaEditar} foi Editada.`) 
        } catch (error) {
            res.status(500)
            return res.send(error.message)   
        }
    }


    async deletarSala(req, res) {
        try {
            const salaParaDeletar = req.params.id;
            const sala = await this.salaService.pegaUmRegistroPorId(salaParaDeletar)
            if(!sala){
                res.status(400)
                return res.send('Sala não encontrada')             
            } 
            
            const salaDeletada = await this.salaService.excluiRegistro(salaParaDeletar)
            res.status(201)
            return res.send(`Sala deletada com sucesso!`) 
        } catch (error) {
            res.status(500)
            return res.send(error.message)           
        }
    }
}


module.exports = SalaController;

