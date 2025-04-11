const Services = require("./Services.js");
const prisma = require('../../prisma/prismaClient');
const StatusReserva = require ('./Constantes.js')

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

    async pegaTodasAsReservas(role, usuarioId) {
        let reservas
        try {
            if (role === 'ADMIN') {
                // Admin vê tudo
                reservas = await prisma.reserva.findMany({
                  include: {
                    usuario: {
                      select: { nome: true, email: true }
                    },
                    sala: {
                        select: { nome: true, capacidade: true }
                    }
                  }
                });
              } else {
                // User vê só as dele
                reservas = await prisma.reserva.findMany({
                  where: {
                    usuarioId: usuarioId
                  },
                  include: {
                    usuario: {
                      select: {nome: true, email: true }
                    },
                    sala: true
                  }
                });
              }

            function cortarString(texto) {
                return texto.length > 25 ? texto.substring(0, 25) + "..." : texto;
            }
            
            // Função para formatar datas no padrão PT-BR
             const formatarData = (data) =>
                new Date(data).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false, // Mantém no formato 24h
                    timeZone: "America/Sao_Paulo", // Ajuste para o fuso correto
            });

            // Mapeia os resultados para ajustar os dados e formatar as datas
            return reservas.map(({ sala, dataHoraInicio, dataHoraFim, horaReserva, id, titulo, status, usuario}) => ({
                id,
                dataHoraInicio: formatarData(dataHoraInicio),
                dataHoraFim: formatarData(dataHoraFim),
                titulo: cortarString(titulo),
                status,
                horaReserva: formatarData(horaReserva),
                nomeSala: sala.nome + " - capacidade: " + sala.capacidade, // Adiciona o nome da sala diretamente 
                usuario: usuario.nome
            }));
    
        } catch (error) {
            console.error("Erro ao buscar reservas:", error.message);
            throw error;
        }
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
            where: {
                status: StatusReserva.PRE_RESERVADO
                // aprovado: false,
                // reprovado: false
            }, 
            orderBy: {horaReserva: 'asc'}
        })
        return reservasParaAprovar;
    }
    async listarSalasNaoAprovadas() {
        const salaNaoReservada = await prisma.reserva.findMany({
            where: {
                status: StatusReserva.NAO_APROVADO
                },
        })
        return salaNaoReservada;
    }
    async listarReservasAprovadas() {
        const reservarAprovadas = await prisma.reserva.findMany({
            where: {
                status: StatusReserva.APROVADO
            },
        })
        return reservarAprovadas;
    }

    async listarReservasPorFiltros(dataHoraInicio, dataHoraFim, salaId, status) {
        const filtro = {};
    
        if (dataHoraInicio && !isNaN(Date.parse(dataHoraInicio))) {
            filtro.dataHoraInicio = { gte: new Date(dataHoraInicio) }; // Busca reservas a partir da data informada
        }
        
        if (dataHoraFim && !isNaN(Date.parse(dataHoraFim))) {
            filtro.dataHoraFim = { lte: new Date(dataHoraFim) }; // Busca reservas até a data informada
        }        
    
        if (salaId) {
            filtro.salaId = Number(salaId); // Converte para número, garantindo compatibilidade com o banco
        }
    
        if (status !== '' && status !== undefined) {
            filtro.status = status; // Filtra pelo status da reserva
        }

   
        function cortarString(texto) {
            return texto.length > 25 ? texto.substring(0, 25) + "..." : texto;
        }
        
        // Função para formatar datas no padrão PT-BR
         const formatarData = (data) =>
            new Date(data).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false, // Mantém no formato 24h
                timeZone: "America/Sao_Paulo", // Ajuste para o fuso correto
        });

        try {
            const reservas = await prisma.reserva.findMany({ 
                    where: filtro,
                    include: {
                        sala: {
                            select: { nome: true, capacidade: true }, // Apenas o nome da sala
                        },
                    }
                });                

            // Mapeia os resultados para ajustar os dados e formatar as datas
            return reservas.map(({ sala, dataHoraInicio, dataHoraFim, horaReserva, id, titulo, status}) => ({
                id,
                dataHoraInicio: formatarData(dataHoraInicio),
                dataHoraFim: formatarData(dataHoraFim),
                titulo: cortarString(titulo),
                status,
                horaReserva: formatarData(horaReserva),
                nomeSala: sala.nome + " - capacidade: " + sala.capacidade, // Adiciona o nome da sala diretamente 
            }));           
        } catch (error) {
            console.error("Erro ao buscar reservas:", error.message);
            throw error;
        }
    }
 
    async criarReservaDeSala(dadosDoRegistro) {
        console.log(dadosDoRegistro);
        
        try {
          return await prisma.reserva.create({
            data: {
              dataHoraInicio: new Date(dadosDoRegistro.dataHoraInicio),
              dataHoraFim: new Date(dadosDoRegistro.dataHoraFim),
              salaId: dadosDoRegistro.salaId,
              titulo: dadosDoRegistro.titulo,
              status: dadosDoRegistro.status,
              usuarioId: dadosDoRegistro.usuarioId
            },
            include: {
                sala: true,
                usuario: { select: { email: true } },
            }
          });
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    async aprovaReserva(id){
        const reservaAprovada = await prisma.reserva.findUnique({
            where: {id: Number(id)}
        })
        if(reservaAprovada.status != StatusReserva.PRE_RESERVADO){
      //  if(!reservaAprovada.PRE_RESERVADO){
            throw new Error (`a ${reservaAprovada} não pode ser aprovada.`)
        }
        await prisma.reserva.update({
            where: { id: Number(id) },
            data: {status: StatusReserva.APROVADO}
        })
        return (`Reserva aprovada com sucesso!`);
    }
    async reprovaReserva(id){
        const reservaReprovada = await prisma.reserva.findUnique({
            where: {id: Number(id)}
        });
        if (reservaReprovada.status != StatusReserva.PRE_RESERVADO) {
            throw new Error("Esta reserva não pode ser reprovada.");
        }   
        await prisma.reserva.update({
            where: { id: Number(id)},
            data: { status: StatusReserva.NAO_APROVADO}
        })
        return (`Reserva reprovada!`);
    }           
    async editaReserva(id, dadosAtualizados){
        const reservaEditada = await prisma.reserva.findUnique({
            where: {id: Number(id)}
        })
        await prisma.reserva.update({
        where: { id: Number(id) },
        data: {...dadosAtualizados}
        })
        return (`A reserva foi atualizada!`)
}

    async cancelaReserva(id){
        const reservaCancelada = await prisma.reserva.findUnique({
            where: {id: Number(id)}
        })
        if (reservaCancelada.status != StatusReserva.APROVADO){
            throw new Error (`o ${reservaCancelada} não pode ser cancelada. Apenas reservas aprovadas podem ser canceladas.`)
        }
            await prisma.reserva.update({
            where: { id: Number(id) },
            data: {status: StatusReserva.CANCELADO}
            })
            return (`A reserva foi cancelada!`)
    }
}

module.exports = ReservaServices; 