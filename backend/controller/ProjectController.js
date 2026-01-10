const Project = require("../model/projectModel");

// Get available templates (only those with status: true)
const getAvailableTemplates = async (req, res) => {
    try {
        const project = await Project.getProjectConfig();
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project configuration not found"
            });
        }

        // Filter templates where status is true and format for frontend
        const availableTemplates = project.availableTemplates
            .filter(t => t.status === true)
            .map(t => ({
                name: t.template,
                label: t.displayName || t.template
            }));

        return res.status(200).json({
            success: true,
            message: "Available templates retrieved successfully",
            templates: availableTemplates
        });
    } catch (err) {
        console.log("Get available templates error:", err);
        return res.status(500).json({
            success: false,
            message: "Server internal error"
        });
    }
};

// Get all templates (including disabled ones) - for admin use
const getAllTemplates = async (req, res) => {
    try {
        const project = await Project.getProjectConfig();
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project configuration not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "All templates retrieved successfully",
            templates: project.availableTemplates
        });
    } catch (err) {
        console.log("Get all templates error:", err);
        return res.status(500).json({
            success: false,
            message: "Server internal error"
        });
    }
};

module.exports = {
    getAvailableTemplates,
    getAllTemplates
};

