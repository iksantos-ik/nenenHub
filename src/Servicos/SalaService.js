const Services = require("./Services.js");
const dataSource = require('../database/models');
const Sala = require('../database/models/sala.js');

class SalaServices extends Services{
    constructor(){
        super('Sala');
    }

    async mostraSalasPorCapacidade(capacidade) {
        const capacidadeNum = Number(capacidade);
        
        if (isNaN(capacidadeNum)) {
            throw new Error("Capacidade inválida");
        }
    
        const salas = await dataSource.Sala.findAll({
            where: {
                capacidade: {
                    [Op.lte]: capacidadeNum // Menor ou igual (<=)
                }
            }
        });
    
        return salas;
    }

    async isNomeSalaUsado(nomeSala) {
        if (!nomeSala || typeof nomeSala !== "string") {
            throw new Error("Nome da sala inválido");
        }
    
        const salas = await dataSource.Sala.findAll({
            where: {
                nome: nomeSala
            }
        });
    
        return salas.length > 0; // Correção do erro de digitação
    }    
    
}

module.exports = SalaServices;