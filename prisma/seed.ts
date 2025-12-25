import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Create Experts
    const expertUser = await prisma.user.upsert({
        where: { email: 'expert@example.com' },
        update: {},
        create: {
            email: 'expert@example.com',
            name: 'Arjun Kapoor',
            role: 'EXPERT',
            expertProfile: {
                create: {
                    bio: '15 years of experience in luxury car market.',
                    specialties: 'Luxury,Sedan,German Cars',
                    hourlyRate: 1500,
                    verified: true,
                    rating: 4.8,
                    reviewCount: 42
                }
            }
        },
    })

    const expertUser2 = await prisma.user.upsert({
        where: { email: 'mechanic@example.com' },
        update: {},
        create: {
            email: 'mechanic@example.com',
            name: 'Sarah Jenkins',
            role: 'EXPERT',
            expertProfile: {
                create: {
                    bio: 'Certified mechanic specializing in reliable family cars.',
                    specialties: 'Reliability,Maintenance,Family Cars',
                    hourlyRate: 800,
                    verified: true,
                    rating: 4.9,
                    reviewCount: 120
                }
            }
        },
    })

    // Create Cars (SQLite doesn't support createMany)
    const cars = [
        {
            make: 'Honda',
            model: 'City',
            variant: 'ZX CVT',
            price: 1600000,
            specs: JSON.stringify({ engine: '1.5L i-VTEC', fuel: 'Petrol', transmission: 'CVT' })
        },
        {
            make: 'Hyundai',
            model: 'Creta',
            variant: 'SX(O) Diesel',
            price: 1900000,
            specs: JSON.stringify({ engine: '1.5L CRDi', fuel: 'Diesel', transmission: 'AT' })
        },
        {
            make: 'Tata',
            model: 'Nexon',
            variant: 'Fearless Plus',
            price: 1450000,
            specs: JSON.stringify({ engine: '1.2L Turbo', fuel: 'Petrol', transmission: 'DCA' })
        }
    ]

    for (const car of cars) {
        await prisma.car.create({ data: car })
    }

    console.log({ expertUser, expertUser2 })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
