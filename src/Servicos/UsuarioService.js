const Services = require("./Services.js");
const prisma = require('../../prisma/prismaClient');
const {hash} = require ('bcryptjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UsuarioService extends Services{
    constructor(){
        super('usuario');
    }

    async verificaUsuario(email){
        const usuarioExistente = await prisma.usuario.findUnique({
            where: {email}
        })
        if (usuarioExistente){
            throw new Error('Usuario já cadastrado')

        }
    }
    async listarTodosUsuarios(){
        return await prisma.usuario.findMany({
            select: {
              id: true,
              nome: true,
              email: true,
              role: true,
              status: true
            }
        });
    }

    async cadastraUsuario(nome, email, senha){
        try {
            await this.verificaUsuario(email);

            const senhaHash = await hash (senha, 8);

            await prisma.usuario.create({
                data: {
                    nome,
                    email,
                    senha: senhaHash,
                    status: 'PENDENTE',
                    role: null
                }
            })
            return true;
            
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao cadastrar usuário')
            
        }
    }

    async login(email, senha){

        const verificaUsuarioExistente =  await prisma.usuario.findUnique({ where: { email } });
        if(!verificaUsuarioExistente){
            throw new Error('Usuario não cadastrado')
        }
        const senhaConfere = await bcrypt.compare(senha, verificaUsuarioExistente.senha);
            if (!senhaConfere) {
                throw new Error('Senha incorreta');
            }
        const token = jwt.sign(
            { id: verificaUsuarioExistente.id, email: verificaUsuarioExistente.email, role: verificaUsuarioExistente.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        return {
            message: 'Login realizado com sucesso',
            token,
            usuario: {
                id: verificaUsuarioExistente.id,
                nome: verificaUsuarioExistente.nome,
                email: verificaUsuarioExistente.email,
                role: verificaUsuarioExistente.role
            }
            
        }
    }

    async aprovaComoUser(id){
        const usuario = await prisma.usuario.update({
            where: { id: Number(id) },
            data: {
              role: 'USER',
              status: 'APROVADO',
            },
          });
      
          res.json(usuario);
    }
    async aprovaComoAdmin(id){
        const usuario = await prisma.usuario.update({
            where: { id: Number(id) },
            data: {
              role: 'ADMIN',
              status: 'APROVADO',
            },
          });
      
          res.json(usuario);
    }
    async reprovaCadastro(id){
        const usuario = await prisma.usuario.update({
            where: { id: Number(id) },
            data: {
              status: 'RECUSADO',
              role: null,
            },
          });
      
          res.json({ mensagem: 'Usuário marcado como recusado.', usuario });
    }
}    

module.exports = UsuarioService;