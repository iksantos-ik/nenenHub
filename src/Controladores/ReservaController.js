const ReservaService = require('../Servicos/ReservaService');
const StatusReserva = require ('../Servicos/Constantes')

class ReservaController {
    constructor (){
      this.reservaService =  new ReservaService();
    }

    async listarReservas(req, res) {
        try {
            const reservas = await this.reservaService.pegaTodasAsReservas();
            res.send(reservas);        
        } catch (error) {
            res.status(500)
            res.send(error.message)        
        }
    }

    async listarReservaPorId(req, res) {
        try {
            const {id} = req.params;
            const reserva = await this.reservaService.pegaUmRegistroPorId(id);
            res.send(reserva);        
        } catch (error) {
            res.status(500)
            res.send(error.message)        
        }
    }

    async listarReservasSala(req, res){
        try {
            const {salaId} = req.params;
            const reservasSala = await this.reservaService.retornaReservasSala(salaId);
            return res.status(200).send(reservasSala);            
        } catch (error) {
            res.status(500)
            res.send(error.message)              
        }
        
    }
    async listarSalasNaoAprovadas(req, res) {
        try {
            const SalaSemReserva = await this.reservaService.listarSalasNaoAprovadas();
            res.send(SalaSemReserva);        
        } catch (error) {
            res.status(500)
            res.send(error.message)        
        }
    }
    async listaDeReservasAprovadas(req, res) {
        try {
            const reservasAprovadas = await this.reservaService.listarReservasAprovadas();
            console.log(reservasAprovadas);
            res.send(reservasAprovadas);        
        } catch (error) {
            res.status(500)
            res.send(error.message)        
        }
    }

    
    async listaReservasParaAprovacao(req,res){
        try {
            const reservasAprovar = await this.reservaService.listarReservasParaAprovar();
            res.send(reservasAprovar);
        } catch (error) {
            res.status(500)
            res.send(error.message)             
        }
    }

    async listagemReservaPorFiltro(req, res) {
        try {
            const {dataHoraInicio, dataHoraFim, salaId, status} = req.query;
            const reservas = await this.reservaService.listarReservasPorFiltros(dataHoraInicio, dataHoraFim, salaId, status);
            res.send(reservas);        
        } catch (error) {
            res.status(500)
            res.send(error.message)        
        }
    }

    async criaReserva(req, res){
        try {
            const {dataHoraInicio, dataHoraFim, salaId, usuario, titulo} = req.body;

            if (!dataHoraInicio && !dataHoraFim || !salaId) {
                return res.status(400).send("❌ Os campos 'data' e 'salaId' são obrigatórios.")
            }
            const existeReserva = await this.reservaService.verificaReservaNoMesmoIntervalo(salaId, dataHoraInicio, dataHoraFim);
            if(existeReserva){
                return res.status(400).send("Já existe uma pré reserva para essa sala nesse intervalo de tempo.")
            }
            if(dataHoraFim < dataHoraInicio){
                return res.status(400).send("Erro! Verifique as datas!")
            }

            const reservaDaSala = await this.reservaService.criarReservaDeSala({
                dataHoraInicio, 
                dataHoraFim,
                salaId: Number(salaId),
                ...(usuario ? { usuario } : {}),
                titulo,
                status: StatusReserva.PRE_RESERVADO
            });

            return res.send(`Sala ${salaId} reservada com sucesso para ${usuario}.`);
        } catch (error) {
            res.status(500)
            res.send(error.message)  
        }
    }
    async aprovarReserva (req,res){
        try {
            const {id} = req.params;
            const reservaDaSalaAprovada = await this.reservaService.aprovaReserva(Number(id));
            res.send(reservaDaSalaAprovada);         
        } catch (error) {
            res.status(500)
            res.send(error.message)              
        }
    }
    async reprovarReserva (req,res){
        try {
            const {id}= req.params;
            const reservaDaSalaReprovada = await this.reservaService.reprovaReserva(Number(id));
            res.send(reservaDaSalaReprovada);         
        } catch (error) {
            res.status(500)
            res.send(error.message)              
        }
    }
    async editarReserva(req,res){
        try {
            const {id} = req.params;
            const reservaParaEditar = req.body;
            const reservaEditada = await this.reservaService.editaReserva(Number(id), reservaParaEditar)     
            res.status(201)
            return res.send(reservaEditada) 
        } catch (error) {
            res.status(500)
            return res.send(error.message)   
        }
    }
    async cancelarReserva(req,res){
        try {
            const reservaParaCancelar = req.params.id;
            const reserva = await this.reservaService.pegaUmRegistroPorId(reservaParaCancelar);     
            const reservaCancelada = await this.reservaService.cancelaReserva(reservaParaCancelar);  
            res.status(201)
            return res.send(reservaCancelada) 
        } catch (error) {
            res.status(500)
            return res.send(error.message)   
        }
    }
    async deletaReserva (req,res){
        try {
            const deletarReserva = Number(req.params.id);
            const reservaDeletada = await this.reservaService.excluiRegistro(deletarReserva);
            res.send(reservaDeletada);         
        } catch (error) {
            res.status(500)
            res.send(error.message)              
        }
    }
}

module.exports = ReservaController;