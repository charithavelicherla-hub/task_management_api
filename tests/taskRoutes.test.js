process.env.DB_FILE = require("path").join(__dirname, "../data/tasks.test.db");

const request = require("supertest");
const app = require("../server");
const { initializeDatabase, getDatabase } = require("../database/database");

describe("Task Management API", () => {
    beforeAll(async () => {
        await initializeDatabase();
    });

    beforeEach(async () => {
        await getDatabase().run("DELETE FROM tasks");
    });

    afterAll(async () => {
        await getDatabase().close();
    });

    test("GET / should confirm that the API is running", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Task Management API is running");
    });

    test("POST /api/tasks should reject a missing title", async () => {
        const response = await request(app).post("/api/tasks").send({
            description: "Test description",
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.errors).toBeDefined();
    });

    test("POST /api/tasks should reject a title shorter than 3 characters", async () => {
        const response = await request(app).post("/api/tasks").send({
            title: "Hi",
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.errors).toBeDefined();
    });

    test("POST /api/tasks should reject an invalid status", async () => {
        const response = await request(app).post("/api/tasks").send({
            title: "Test task",
            status: "invalid",
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.errors).toBeDefined();
    });

    test("GET /unknown should return 404", async () => {
        const response = await request(app).get("/unknown");

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });

    test("POST /api/tasks should create a task successfully", async () => {
        const response = await request(app).post("/api/tasks").send({
            title: "Complete assignment",
            description: "Finish the API testing task",
            status: "pending",
            priority: "high",
        });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe("Complete assignment");
        expect(response.body.data.priority).toBe("high");
    });

    test("GET /api/tasks should return the task list", async () => {
        await request(app).post("/api/tasks").send({
            title: "Study Java",
            description: "Practice Java programs",
        });

        const response = await request(app).get("/api/tasks");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.count).toBe(1);
        expect(response.body.data[0].title).toBe("Study Java");
    });

    test("GET /api/tasks/:id should return a task by ID", async () => {
        const created = await request(app).post("/api/tasks").send({
            title: "Read documentation",
        });

        const taskId = created.body.data.id;

        const response = await request(app).get(`/api/tasks/${taskId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe("Read documentation");
    });

    test("PUT /api/tasks/:id should update a task", async () => {
        const created = await request(app).post("/api/tasks").send({
            title: "Original task",
        });

        const taskId = created.body.data.id;

        const response = await request(app).put(`/api/tasks/${taskId}`).send({
            title: "Updated task",
            description: "Task updated successfully",
            status: "completed",
            priority: "high",
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe("Updated task");
        expect(response.body.data.status).toBe("completed");
    });

    test("DELETE /api/tasks/:id should delete a task", async () => {
        const created = await request(app).post("/api/tasks").send({
            title: "Task to delete",
        });

        const taskId = created.body.data.id;

        const response = await request(app).delete(`/api/tasks/${taskId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

        const check = await request(app).get(`/api/tasks/${taskId}`);

        expect(check.statusCode).toBe(404);
    });

    test("GET /api/tasks/:id should return 404 for a missing task", async () => {
        const response = await request(app).get("/api/tasks/999999");

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Task not found");
    });

    test("DELETE /api/tasks/:id should return 404 for a missing task", async () => {
        const response = await request(app).delete("/api/tasks/999999");

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Task not found");
    });
});
