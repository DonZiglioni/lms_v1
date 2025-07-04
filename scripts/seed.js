const { PrismaClient } = require('@prisma/client')

const database = new PrismaClient()

const main = async () => {
    try {
        await database.category.createMany({
            data: [
                { name: "Audio Engineering" },
                { name: "Music Business" },
                { name: "Live Sound" },
                { name: "Mixing" },
                { name: "Mastering" },
                { name: "Songwriting" },
                { name: "Production" },
            ]
        })
        console.log("Success");

    } catch (error) {
        console.log("Error seeding the db categories: ", error);

    } finally {
        await database.$disconnect()
    }
}

main()