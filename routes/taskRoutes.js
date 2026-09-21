const { taskValidation } = require("../middleware/validation");
const express = require("express");
const { getDatabase } = require("../database/database");

const router = express.Router();

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Retrieve all tasks from the database.
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: Successfully retrieved all tasks
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res, next) => {
    try {
        const db = getDatabase();

        const tasks = await db.all(`
            SELECT *
            FROM tasks
            ORDER BY id DESC
        `);

        res.json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        next(error);
    }
});


/**
 * @openapi
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task and store it in the database.
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete REST API project
 *               description:
 *                 type: string
 *                 example: Build backend using Node.js and Express
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - in-progress
 *                   - completed
 *                 example: pending
 *               priority:
 *                 type: string
 *                 enum:
 *                   - low
 *                   - medium
 *                   - high
 *                 example: high
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", taskValidation, async (req, res, next) => {
    try {
        const { title, description, status, priority } = req.body;

        const db = getDatabase();

        const result = await db.run(
            `
            INSERT INTO tasks
            (title, description, status, priority)
            VALUES (?, ?, ?, ?)
            `,
            [
                title,
                description || null,
                status || "pending",
                priority || "medium"
            ]
        );

        const newTask = await db.get(
            "SELECT * FROM tasks WHERE id = ?",
            result.lastID
        );

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: newTask
        });
    } catch (error) {
        next(error);
    }
});


module.exports = router;