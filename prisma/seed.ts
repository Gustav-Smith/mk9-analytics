import { PrismaClient, VisitStatus, UserRole, OperationStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed idempotente...')

  // 0. Owner User (Admin) - upsert by email
  const ownerUser = await prisma.user.upsert({
    where: { email: 'admin@mk9analytics.com' },
    update: {},
    create: {
      email: 'admin@mk9analytics.com',
      name: 'Gustavo (Owner)',
      role: UserRole.ADMIN,
      password: 'admin123', // plain password for seed only - change in production!
    },
  })
  console.log('👤 Usuário Owner configurado com sucesso!')

  // 1. Supervisor - upsert by email (assuming email is unique per schema)
  const supervisor = await prisma.supervisor.upsert({
    where: { email: 'supervisor@mk9.com' },
    update: {},
    create: {
      name: 'Supervisor Geral',
      email: 'supervisor@mk9.com',
    },
  })
  console.log(`✓ Supervisor: ${supervisor.name}`)

  // 2. Promotores - ensure exist by name + supervisorId (no unique field)
  const promoterData = [
    { name: 'Promotor Carlos', city: 'São Paulo', state: 'SP' },
    { name: 'Promotora Ana', city: 'Rio de Janeiro', state: 'RJ' },
  ]

  const promoters = []
  for (const data of promoterData) {
    const existing = await prisma.promoter.findFirst({
      where: {
        name: data.name,
        supervisorId: supervisor.id,
      },
    })
    if (existing) {
      promoters.push(existing)
    } else {
      const created = await prisma.promoter.create({
        data: {
          ...data,
          supervisorId: supervisor.id,
        },
      })
      promoters.push(created)
    }
  }
  console.log(`✓ ${promoters.length} promotores garantidos`)

  // 3. Indústrias - upsert by code
  const industriesData = [
    { code: 'BEB001', name: 'Indústria de Bebidas X' },
    { code: 'ALI002', name: 'Indústria de Alimentos Y' },
  ]

  const industries = []
  for (const data of industriesData) {
    const ind = await prisma.industry.upsert({
      where: { code: data.code },
      update: {},
      create: data,
    })
    industries.push(ind)
  }
  console.log(`✓ ${industries.length} indústrias garantidas`)

  // 4. Lojas - upsert by code
  const storesData = [
    { code: 'SMC001', name: 'Supermercado Centro', chain: 'Rede Nacional', city: 'São Paulo', state: 'SP' },
    { code: 'HMS002', name: 'Hipermercado Sul', chain: 'Rede Sul', city: 'Porto Alegre', state: 'RS' },
  ]

  const stores = []
  for (const data of storesData) {
    const store = await prisma.store.upsert({
      where: { code: data.code },
      update: {},
      create: data,
    })
    stores.push(store)
  }
  console.log(`✓ ${stores.length} lojas garantidas`)

  // 5. Operação - upsert by month+year (unique constraint from schema: @@unique([month, year]))
  const now = new Date()
  const currentMonth = now.getMonth() + 1 // Janeiro = 0
  const currentYear = now.getFullYear()

  const operation = await prisma.operation.upsert({
    where: {
      month_year: {
        month: currentMonth,
        year: currentYear,
      },
    },
    update: {},
    create: {
      name: `Operação ${new Date().toLocaleString('pt-br', { month: 'long' }).toUpperCase()} ${currentYear}`,
      month: currentMonth,
      year: currentYear,
      status: OperationStatus.OPEN,
      startsAt: new Date(currentYear, currentMonth - 1, 1), // Primeiro dia do mês
      endsAt: new Date(currentYear, currentMonth, 0, 23, 59, 59), // Último dia do mês
    },
  })
  console.log(`✓ Operação: ${operation.name}`)

  // 6. Visitas - limpar e criar novamente (idempotente via deleteMany + createMany)
  await prisma.visit.deleteMany({})
  console.log('🧹 Visitas antigas removidas')

  const visitsData = [
    {
      promoterId: promoters[0].id,
      storeId: stores[0].id,
      industryId: industries[0].id,
      scheduledDate: new Date(currentYear, currentMonth - 1, 5, 10, 30), // Dia 5 às 10:30
      status: VisitStatus.REALIZADA,
    },
    {
      promoterId: promoters[1].id,
      storeId: stores[1].id,
      industryId: industries[1].id,
      scheduledDate: new Date(currentYear, currentMonth - 1, 8, 14, 0), // Dia 8 às 14:00
      status: VisitStatus.PLANEJADA,
    },
    {
      promoterId: promoters[0].id,
      storeId: stores[0].id,
      industryId: industries[1].id,
      scheduledDate: new Date(currentYear, currentMonth - 1, 12, 9, 15), // Dia 12 às 09:15
      status: VisitStatus.CANCELADA,
    },
    {
      promoterId: promoters[1].id,
      storeId: stores[0].id,
      industryId: industries[0].id,
      scheduledDate: new Date(currentYear, currentMonth - 1, 15, 16, 45), // Dia 15 às 16:45
      status: VisitStatus.REALIZADA,
    },
    {
      promoterId: promoters[0].id,
      storeId: stores[1].id,
      industryId: industries[0].id,
      scheduledDate: new Date(currentYear, currentMonth - 1, 18, 11, 0), // Dia 18 às 11:00
      status: VisitStatus.PLANEJADA,
    },
    {
      promoterId: promoters[1].id,
      storeId: stores[1].id,
      industryId: industries[1].id,
      scheduledDate: new Date(currentYear, currentMonth - 1, 22, 13, 30), // Dia 22 às 13:30
      status: VisitStatus.REALIZADA,
    },
    {
      promoterId: promoters[0].id,
      storeId: stores[0].id,
      industryId: industries[0].id,
      scheduledDate: new Date(currentYear, currentMonth - 1, 25, 10, 0), // Dia 25 às 10:00
      status: VisitStatus.CANCELADA,
    },
    {
      promoterId: promoters[1].id,
      storeId: stores[0].id,
      industryId: industries[1].id,
      scheduledDate: new Date(currentYear, currentMonth - 1, 28, 15, 45), // Dia 28 às 15:45
      status: VisitStatus.PLANEJADA,
    },
  ]

  const visits = await prisma.visit.createMany({
    data: visitsData.map((v) => ({
      operationId: operation.id,
      promoterId: v.promoterId,
      storeId: v.storeId,
      industryId: v.industryId,
      scheduledDate: v.scheduledDate,
      status: v.status,
      completedDate:
        v.status === VisitStatus.REALIZADA
          ? new Date(
              v.scheduledDate.getTime() +
                Math.floor(Math.random() * 2 * 60 * 60 * 1000)
            ) // Completa entre 0-2 horas depois
          : null,
    })),
    skipDuplicates: true,
  })
  console.log(`✓ ${visits.count} visitas criadas`)

  console.log('✅ Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })