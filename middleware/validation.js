const { body, validationResult } = require("express-validator");

const taskValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Title must be between 3 and 100 characters"),

    body("description")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),

    body("status")
        .optional()
        .isIn(["pending", "in-progress", "completed"])
        .withMessage("Status must be pending, in-progress, or completed"),

    body("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Priority must be low, medium, or high"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        next();
    }
];

module.exports = {
    taskValidation
};