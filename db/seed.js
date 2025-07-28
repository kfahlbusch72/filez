import db from "#db/client";

const folderNames = ["Documents", "Pictures", "Music"];

const sampleFiles = [
  { name: "file1.txt", size: 1000 },
  { name: "file2.txt", size: 2000 },
  { name: "file3.txt", size: 3000 },
  { name: "file4.txt", size: 4000 },
  { name: "file5.txt", size: 5000 },
];

export default async function seed() {
  for (const name of folderNames) {
    const {
      rows: [folder],
    } = await db.query(`INSERT INTO folders(name) VALUES ($1) RETURNING *`, [
      name,
    ]);

    for (let i = 0; i < sampleFiles.length; i++) {
      const file = sampleFiles[i];
      const filename = `${name}-${file.name}`;
      await db.query(
        `INSERT INTO files(name, size, folder_id) VALUES ($1, $2, $3)`,
        [filename, file.size, folder.id]
      );
    }
  }
}
