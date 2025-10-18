import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.author.createMany({
    data: [
      { name: "John Doe", bio: "John Doe is a software engineer" },
      { name: "Phillip Doe", bio: "Phillip Doe is not a software engineer" },
    ],
  });

  await prisma.category.createMany({
    data: [{ name: "Science Fiction" }, { name: "Mystery" }],
  });

  const allAuthors = await prisma.author.findMany();
  const allCategories = await prisma.category.findMany();

  const john = allAuthors.find((author) => author.name === "John Doe");
  const scienceFiction = allCategories.find(
    (category) => category.name === "Science Fiction"
  );

  if (john && scienceFiction) {
    await prisma.book.create({
      data: {
        title: "The Great Gatsby",
        description: "The Great Gatsby is a novel by F. Scott Fitzgerald",
        publishedAt: new Date("1925-04-10"),
        authors: { connect: { id: john.id } },
        categories: { connect: { id: scienceFiction.id } },
      },
    });
  }

  console.log("✅ Seeding finished.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
