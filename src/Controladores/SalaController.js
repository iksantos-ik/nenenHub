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
            const numCapacidade = req.params.capacidade;
            if(numCapacidadecapacidade && Number(numCapacidade)){
                const salaCapacidade = await this.salaService.mostraSalasPorCapacidade(numCapacidade);
                res.send(salaCapacidade);
            } else {
                res.status(422)
                res.send("Infelizmente não temos sala para essa capacidade!")
            } 
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
}


module.exports = SalaController;

