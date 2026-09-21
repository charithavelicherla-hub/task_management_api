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
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     description: Retrieve a single task using its ID.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", async (req, res, next) => {
    try {
        const db = getDatabase();
        const { id } = req.params;

        const task = await db.get(
            "SELECT * FROM tasks WHERE id = ?",
            id
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.json({
            success: true,
            data: task
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


/**
 * @openapi
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Update an existing task using its ID.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
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
 *                 example: Updated task title
 *               description:
 *                 type: string
 *                 example: Updated task description
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - in-progress
 *                   - completed
 *                 example: in-progress
 *               priority:
 *                 type: string
 *                 enum:
 *                   - low
 *                   - medium
 *                   - high
 *                 example: high
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", taskValidation, async (req, res, next) => {
    try {
        const db = getDatabase();
        const { id } = req.params;
        const { title, description, status, priority } = req.body;

        const existingTask = await db.get(
            "SELECT * FROM tasks WHERE id = ?",
            id
        );

        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        await db.run(
            `
            UPDATE tasks
            SET title = ?,
                description = ?,
                status = ?,
                priority = ?
            WHERE id = ?
            `,
            [
                title,
                description || null,
                status || "pending",
                priority || "medium",
                id
            ]
        );

        const updatedTask = await db.get(
            "SELECT * FROM tasks WHERE id = ?",
            id
        );

        res.json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask
        });
    } catch (error) {
        next(error);
    }
});


/**
 * @openapi
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Delete an existing task using its ID.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res, next) => {
    try {
        const db = getDatabase();
        const { id } = req.params;

        const existingTask = await db.get(
            "SELECT * FROM tasks WHERE id = ?",
            id
        );

        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        await db.run(
            "DELETE FROM tasks WHERE id = ?",
            id
        );

        res.json({
            success: true,
            message: "Task deleted successfully"
        });
    } catch (error) {
        next(error);
    }
});


module.exports = router;