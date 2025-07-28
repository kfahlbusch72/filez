import db from "#db/client";

export default async function seed() {
  const folderNames = ["Docs", "Media", "Projects"];

  for (const name of folderNames) {
    const {
      rows: [folder],
    } = await db.query(`INSERT INTO folders(name) VALUES ($1) RETURNING *`, [
      name,
    ]);

    for (let i = 1; i <= 5; i++) {
      await db.query(
        `INSERT INTO files(name, size, folder_id) VALUES ($1, $2, $3)`,
        [`${name.toLowerCase()}_file${i}.txt`, 1000 * i, folder.id]
      );
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await db.connect();
  await seed();
  await db.end();
  console.log("Database seeded.");
}
