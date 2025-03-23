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