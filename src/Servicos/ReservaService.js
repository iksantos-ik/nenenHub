const Services = require("./Services.js");
const prisma = require('../../prisma/prismaClient');

class ReservaServices extends Services {
    constructor() {
        super('reserva');
    }
    async verificaReservaNoMesmoIntervalo(salaId, dataHoraInicio, dataHoraFim) {
        const inicio = new Date(dataHoraInicio);
        const fim = new Date(dataHoraFim);

        const reservasExistentes = await prisma.reserva.findMany({
            where: {
                salaId: salaId,
            OR:
                [
                    { // Caso 1: Início dentro de uma reserva existente
                        AND: [
                            { dataHoraInicio: { lte: inicio } }, // Começa antes ou no mesmo momento
                            { dataHoraFim: { gte: inicio } }  // Termina depois ou no mesmo momento
                            ]
                    },
                    { // Caso 2: Fim dentro de uma reserva existente
                        AND: [
                            { dataHoraInicio: { lte: fim } }, // Começa antes ou no mesmo momento
                            { dataHoraFim: { gte: fim } }  // Termina depois ou no mesmo momento
                            ]
                    },
                    { // Caso 3: A reserva existente cobre todo o período solicitado
                        AND: [
                            { dataHoraInicio: { gte: inicio } }, // Começa depois ou no mesmo momento
                            { dataHoraFim: { lte: fim } }  // Termina antes ou no mesmo momento
                            ]
                    }
                ]
            }
        })
        return reservasExistentes.length > 0;
    }
    async retornaReservasSala(salaId){
        const reservasSala = await prisma.reserva.findMany({
            where: {salaId: Number(salaId)},
            orderBy: {horaReserva: 'asc'}
        })
        return reservasSala;
    }
    async listarReservasParaAprovar (){
        const reservasParaAprovar = await prisma.reserva.findMany({
            where: {aprovado: false,
                reprovado: false
            }, 
            orderBy: {horaReserva: 'asc'}
        })
        return reservasParaAprovar;
    }
    async listarSalasNaoReservadas() {
        const salaNaoReservada = await prisma.reserva.findMany({
            where: {
                aprovado: false,
                reprovado: true
                },
        })
        return salaNaoReservada;
    }


    async aprovaReserva(id){
        const reservaAprovada = await prisma.reserva.findUnique({
            where: {id: Number(id)}
        })
        if (!reservaAprovada){
            throw new Error (`o ${reservaAprovada} não foi encontrado.`)
        }
        if(reservaAprovada.aprovado){
            throw new Error (`o ${reservaAprovada} já foi aprovada.`)
        }
        if(this.verificaReservaNoMesmoIntervalo(id)){
            throw new Error (`Já existe uma reserva aprovada para a sala ${reservaAprovada.id} nesse horário`);
        }

        return await prisma.reserva.update({
            where: { id: Number(id) },
            data: { aprovado: true }
        })
    }
    async reprovaReservaConflitante(salaId){
        const reservasAprovadas = await prisma.reserva.findMany({
            where: {salaId: Number(salaId),
                    aprovado: true
            },
            orderBy: {horaReserva: 'asc'},
        });
        if (reservasAprovadas.length === 0) {
            throw new Error("Nenhuma reserva aprovada encontrada para esta sala.");
        }
        const reservaAprovada = reservasAprovadas[0]; // Pega a reserva mais antiga aprovada
        const inicioAprovado = new Date(reservaAprovada.dataHoraInicio);
        const fimAprovado = new Date(reservaAprovada.dataHoraFim);

        const reservasReprovar = await prisma.reserva.findMany({
            where: {
                salaId: Number(salaId),
                aprovado: false
            },
            OR: [
                { 
                    AND: [
                        { dataHoraInicio: { lte: fimAprovado } }, 
                        { dataHoraFim: { gte: inicioAprovado } }
                    ] 
                }
            ]
        })
        if (reservasReprovar.length === 0) {
            return "Nenhuma reserva conflitante foi encontrada para reprovação.";
        }   
        
        await prisma.reserva.updateMany({
            where: { salaId: Number(salaId) },
            data: { reprovado: true }
        })
        return `Foram reprovadas ${reservasReprovar.length} reservas conflitantes na sala ${salaId}.`;
    }
    

}


module.exports = ReservaServices; 