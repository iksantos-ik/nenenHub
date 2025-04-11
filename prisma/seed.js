// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Criptografa a senha
  const senhaHash = await bcrypt.hash('123456', 10);

  // Cria ou garante a existência do ADMIN principal
  await prisma.usuario.upsert({
    where: { email: 'admin@nenemhub.com' },
    update: {},
    create: {
      nome: 'Admin Principal',
      email: 'admin@nenemhub.com',
      senha: senhaHash,
      role: 'ADMIN'
    }
  });

  console.log('✅ Admin criado ou já existia!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
