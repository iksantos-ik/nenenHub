const ReservaService = require('../Servicos/ReservaService');

class ReservaController {
    constructor (){
      this.reservaService =  new ReservaService();
    }

    async listarReservas(req, res) {
        try {
            const reservas = await this.reservaService.pegaTodosOsRegistros();
            res.send(reservas);        
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
    async listarSalasNaoReservadas(req, res) {
        try {
            const SalaSemReserva = await this.reservaService.listarSalasNaoReservadas();
            res.send(SalaSemReserva);        
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

            const reservaDaSala = await this.reservaService.criaRegistro({
                dataHoraInicio, 
                dataHoraFim,
                salaId: Number(salaId),
                ...(usuario ? { usuario } : {}),
                titulo,
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
            res.send(`A reserva da sala foi aprovada`);         
        } catch (error) {
            res.status(500)
            res.send(error.message)              
        }
    }
    async reprovarReservaConflitante (req,res){
        try {
            const {salaId}= req.params;
            const reservaDaSalaReprovada = await this.reservaService.reprovaReservaConflitante(Number(salaId));
            res.send(`A reserva da sala ${reservaDaSalaReprovada} foi reprovada, pois já existia uma pre reserva para o mesmo horario.`);         
        } catch (error) {
            res.status(500)
            res.send(error.message)              
        }
    }
    async deletaReserva (req,res){
        try {
            const deletarReserva = Number(req.params.id);
            const reservaDeletada = await this.reservaService.excluiRegistro(deletarReserva);
            res.send(`A reserva ${reservaDeletada} foi excluida.`);         
        } catch (error) {
            res.status(500)
            res.send(error.message)              
        }
    }
}

module.exports = ReservaController;