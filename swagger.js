const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Task Management REST API",
            version: "1.0.0",
            description:
                "RESTful API for managing tasks using Node.js, Express and SQLite."
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },

    apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;