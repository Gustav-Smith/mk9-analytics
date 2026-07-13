import { PrismaClient, VisitStatus, OperationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Iniciando seed...");

    const operation = await prisma.operation.upsert({
        where: {
            month_year: {
                month: 7,
                year: 2026,
            },
        },
        update: {},
        create: {
            name: "Julho/2026",
            month: 7,
            year: 2026,
            status: OperationStatus.OPEN,
            startsAt: new Date("2026-07-01"),
            endsAt: new Date("2026-07-31"),
        },
    });

    const supervisor = await prisma.supervisor.upsert({
        where: {
            email: "supervisor@mk9.com",
        },
        update: {},
        create: {
            name: "Supervisor Teste",
            email: "supervisor@mk9.com",
        },
    });

    const industry = await prisma.industry.upsert({
        where: {
            code: "IND001",
        },
        update: {},
        create: {
            code: "IND001",
            name: "Indústria Teste",
        },
    });

    const store = await prisma.store.upsert({
        where: {
            code: "LJ001",
        },
        update: {},
        create: {
            code: "LJ001",
            name: "Loja Teste",
            chain: "Rede X",
            city: "Brasília",
            state: "DF",
        },
    });

    const promoter = await prisma.promoter.create({
        data: {
            name: "Promotor Teste",
            city: "Brasília",
            state: "DF",
            supervisorId: supervisor.id,
        },
    });

    await prisma.visit.createMany({
        data: [
            {
                operationId: operation.id,
                promoterId: promoter.id,
                storeId: store.id,
                industryId: industry.id,
                status: VisitStatus.PLANEJADA,
                scheduledDate: new Date("2026-07-05"),
            },
            {
                operationId: operation.id,
                promoterId: promoter.id,
                storeId: store.id,
                industryId: industry.id,
                status: VisitStatus.PLANEJADA,
                scheduledDate: new Date("2026-07-12"),
            },
            {
                operationId: operation.id,
                promoterId: promoter.id,
                storeId: store.id,
                industryId: industry.id,
                status: VisitStatus.REALIZADA,
                scheduledDate: new Date("2026-07-19"),
                completedDate: new Date("2026-07-19"),
            },
        ],
    });

    console.log("✅ Seed concluído com sucesso!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });