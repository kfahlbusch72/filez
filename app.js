import express from "express";
import db from "#db/client";

const app = express();
app.use(express.json());

app.get("/files", async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT files.*, folders.name AS folder_name
      FROM files
      JOIN folders ON files.folder_id = folders.id
    `);
    res.send(rows);
  } catch (err) {
    next(err);
  }
});

app.get("/folders", async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM folders");
    res.send(rows);
  } catch (err) {
    next(err);
  }
});

app.get("/folders/:id", async (req, res, next) => {
  try {
    const folderId = Number(req.params.id);
    const {
      rows: [folder],
    } = await db.query(`SELECT * FROM folders WHERE id = $1`, [folderId]);

    if (!folder) return res.status(404).send("Folder not found");

    const { rows: files } = await db.query(
      `SELECT * FROM files WHERE folder_id = $1`,
      [folderId]
    );

    res.send({ ...folder, files });
  } catch (err) {
    next(err);
  }
});

app.post("/folders/:id/files", async (req, res, next) => {
  try {
    const folderId = Number(req.params.id);
    const { name, size } = req.body;

    const {
      rows: [folder],
    } = await db.query(`SELECT * FROM folders WHERE id = $1`, [folderId]);

    if (!folder) return res.status(404).send("Folder not found");
    if (!req.body) return res.status(400).send("Missing request body");
    if (!name || !size) return res.status(400).send("Missing required fields");

    const {
      rows: [file],
    } = await db.query(
      `INSERT INTO files(name, size, folder_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, size, folderId]
    );

    res.status(201).send(file);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal server error");
});

export default app;
