import { pool } from "../../db/connect.js";
import { createCustomError } from "../../errors/customErrors.js";
import { tryCatchWrapper } from "../../middlewares/tryCatchWrapper.js";

/**
 * @returns note object
 */
async function getNote(id) {
  let sql = "SELECT * FROM notes WHERE id = ?";
  const [rows] = await pool.query(sql, [id]);
  return rows[0];
}

/**
 * @description Get All note
 * @route GET /notes
 */
export const getAllNotes = tryCatchWrapper(async function (req, res, next) {
  let sql = "SELECT * from notes";
  const [rows] = await pool.query(sql);
  if (!rows.length) return res.status(204).json({ message: "empty list" });

  return res.status(200).json({ notes: rows });
});

/**
 * @description Get Single note
 * @route GET /notes/:id
 */
export const getSingleNote = tryCatchWrapper(async function (req, res, next) {
  const { id } = req.params;

  const note = await getNote(id);
  if (!note) return next(createCustomError("note not found", 404));

  return res.status(200).json(note);
});

/**
 * @description Create note
 * @route POST /notes
 */
export const createNote = tryCatchWrapper(async function (req, res, next) {
  const { title, contents } = req.body;

  if (!title || !contents)
    return next(createCustomError("All fields are required", 400));

  let sql = "INSERT INTO notes (title, contents) VALUES (?, ?)";
  await pool.query(sql, [title, contents]);

  return res.status(201).json({ message: "note has been created" });
});

/**
 * @description Update note
 * @route PATCH /notes/:id
 */
export const updateNote = tryCatchWrapper(async function (req, res, next) {
  const { id } = req.params;
  const { title, contents } = req.body;

  if (!id || !title || !contents)
    return next(createCustomError("All fields are required", 400));

  const note = await getNote(id);
  if (!note) return next(createCustomError("note not found", 404));

  let sql = "UPDATE notes SET title = ? , contents = ? WHERE id = ?";
  await pool.query(sql, [title, contents, id]);

  return res.status(201).json({ message: "note has been updated" });
});

/**
 * @description Delete note
 * @route DELETE /notes/:id
 */
export const deleteNote = tryCatchWrapper(async function (req, res, next) {
  const { id } = req.params;

  if (!id) return next(createCustomError("Id is required", 400));

  const note = await getNote(id);
  if (!note) return next(createCustomError("note not found", 404));

  let sql = "DELETE FROM notes WHERE id = ?";
  await pool.query(sql, [id]);

  return res.status(200).json({ message: "note has been deleted" });
});
