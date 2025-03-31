const Services = require("./Services.js");
const prisma = require('../../prisma/prismaClient');
const ReservaServices = require ("./ReservaService.js");

class SalaServices extends Services{
    constructor(){
        super('sala');
        this.reservaService = new ReservaServices();
    }

    async isNomeSalaUsado(nomeSala) {
        if (!nomeSala || typeof nomeSala !== "string") {
            throw new Error("Nome da sala inválido");
        }
    
        return await prisma.sala.findUnique({
            where: {
                nome: nomeSala
            }
        });
    }   

    async pegaUmRegistroPorCapacidade(capacidade) {
        return await prisma[this.model].findMany({
          where: {capacidade: Number(capacidade)}
        });  
    }

    async listarSalaPorFiltros(nome, capacidade, ativa) {
        const filtro = {};
        if (nome) {
            filtro.nome = { contains: nome }; // Removido "mode" porque o Prisma 3.0+ já é insensível por padrão em alguns bancos de dados
        }
    
        if (capacidade) {
            const capacidadeNum = Number(capacidade);
            filtro.capacidade = { gte: capacidadeNum, lte: capacidadeNum + 10 };
        }
    
        if (ativa != "" & ativa != undefined) {
            filtro.ativa = ativa == 'true'? true : false;
        }
    
        try {
            const capturar = await prisma.sala.findMany({ where: filtro });
           // console.log(capturar); // Exibe as salas encontradas no console
            return capturar; // Retorna as salas para o caller
        } catch (error) {
            console.log(error); // Exibe o erro no console caso algo falhe
        }
    }    
    
    async salaInativar(id) {
        return await prisma.sala.update({
            where: { id: Number(id) },
            data: { ativa: false }
        });
    }
    async salaAtivar(id) {
        return await prisma.sala.update({
            where: { id: Number(id) },
            data: { ativa: true }
        });
    }
    async excluiRegistro(id) {
        const reservasDaSala =  await this.reservaService.retornaReservasSala(id);
        if(reservasDaSala.length > 0){
            // await this.salaInativar(id)
            // return;
            throw new Error("A sala não pode ser excluida pois existem reservas a ela.");
        }
        
        return await prisma[this.model].delete({ 
          where: { id: Number(id) } });
      }
}

module.exports = SalaServices;