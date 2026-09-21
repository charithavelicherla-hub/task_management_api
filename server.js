const express = require("express");
const { initializeDatabase } = require("./database/database");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Task Management API is running"
    });
});

// Task API routes
app.use("/api/tasks", taskRoutes);

// Swagger API Documentation
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// 404 Handling
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Error Handling
app.use(errorHandler);

// Start server
async function startServer() {
    try {
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
}

startServer();