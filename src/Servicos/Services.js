//const dataSource = require('../database/models');
const prisma = require('../../prisma/prismaClient');


class Services {
    constructor(nomeDoModel) {
        this.model = nomeDoModel;
    }
    
    async pegaTodosOsRegistros () {
        console.log("Modelo usado:", this.model);
        return await prisma[this.model].findMany();
    }
    async pegaRegistrosAtivos (ativa) {
      return await prisma[this.model].findMany({
        where: {ativa: true}
      });
    }

    async pegaUmRegistroPorId(id) {
    return await prisma[this.model].findUnique({
      where: {id: Number(id)}
    });
  }
  
  // async pegaUmRegistroPorCapacidade(capacidade) {
  //   return await prisma[this.model].findMany({
  //     where: {capacidade: Number(capacidade)}
  //   });
  // }
      async pegaEContaRegistros(where) {
      return dataSource[this.model].findUnique({where: {...where},
        //limit: 2,
        order:  [['id', 'DESC']]
      });
    }

    async criaRegistro(dadosDoRegistro) {
      console.log(dadosDoRegistro)
      try{
        return await prisma[this.model].create({
          data: { ...dadosDoRegistro },
        });
      }catch(e){
        console.log(e)
      }
    }  

    async atualizaRegistro(id, dadosAtualizados){
      return await prisma[this.model].update({
        where: { id: id },
        data: dadosAtualizados
      }) 
    }

  async excluiRegistro(id) {
    return await prisma[this.model].delete({ 
      where: { id: Number(id) } });
  }
}

module.exports = Services;