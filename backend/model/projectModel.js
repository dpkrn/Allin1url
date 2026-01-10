const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    // Project name/identifier (singleton - only one project config)
    projectName: {
        type: String,
        default: 'LinkBridger',
        unique: true
    },
    
    // Available templates configuration
    availableTemplates: [{
        template: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: Boolean,
            default: true
        },
        displayName: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        }
    }],
    
    // Other project configuration can be added here
    // e.g., maintenance mode, feature flags, etc.
    
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Static method to get or create project config (singleton pattern)
projectSchema.statics.getProjectConfig = async function() {

    const defaultTemplates = [
        { template: 'default', status: true, displayName: 'Default', description: 'Clean and simple default template' },
        { template: 'minimal', status: true, displayName: 'Minimal', description: 'Minimalist design' },
        { template: 'modern', status: true, displayName: 'Modern', description: 'Modern and sleek design' },
        { template: 'dark', status: true, displayName: 'Dark', description: 'Dark theme template' },
        { template: 'light', status: true, displayName: 'Light', description: 'Light theme template' },
        { template: 'hacker', status: true, displayName: 'Hacker', description: 'Hacker-style template' },
        { template: 'glass', status: true, displayName: 'Glass', description: 'Glassmorphism design' },
        { template: 'neon', status: true, displayName: 'Neon', description: 'Neon glow effects' },
        { template: 'gradient', status: true, displayName: 'Gradient', description: 'Gradient backgrounds' },
        { template: 'cards', status: true, displayName: 'Cards', description: 'Card-based layout' },
        { template: 'particles', status: true, displayName: 'Particles', description: 'Particle effects' },
        { template: '3d', status: true, displayName: '3D', description: '3D effects template' },
        { template: 'retro', status: true, displayName: 'Retro', description: 'Retro style template' },
        { template: 'water', status: true, displayName: 'Water', description: 'Water effects with flowing waves and bubbles' },
        { template: 'forest', status: true, displayName: 'Forest', description: 'Forest theme with falling leaves and nature effects' },
        { template: 'royal', status: true, displayName: 'Royal', description: 'Royal/Lords theme with gold accents and regal styling' },
        { template: 'space', status: true, displayName: 'Space', description: 'Space theme with twinkling stars and cosmic effects' },
        { template: 'ocean', status: true, displayName: 'Ocean', description: 'Ocean theme with waves, bubbles, and swimming fish' },
        { template: 'fire', status: true, displayName: 'Fire', description: 'Fire theme with flickering flames and rising embers' },
        { template: 'galaxy', status: true, displayName: 'Galaxy', description: 'Galaxy theme with nebula clouds and spiral patterns' },
        { template: 'mountain', status: true, displayName: 'Mountain', description: 'Mountain theme with peaks, snow, and clouds' },
        { template: 'storm', status: true, displayName: 'Storm', description: 'Storm theme with lightning flashes and rain effects' },
        { template: 'mystical', status: true, displayName: 'Mystical', description: 'Mystical theme with floating orbs and magic particles' }
    ];

    let project = await this.findOne({ 
        projectName: 'LinkBridger',
        deletedAt: null 
    });

    // Create project if it doesn't exist
    if (!project) {
        project = await this.create({
            projectName: 'LinkBridger',
            availableTemplates: defaultTemplates
        });
        return project;
    }

    // Add templates that don't exist in the database
    const existingTemplateNames = project.availableTemplates.map(t => t.template);
    const notExistingTemplates = defaultTemplates.filter(template => 
        !existingTemplateNames.includes(template.template)
    );
    
    if (notExistingTemplates.length > 0) {
        project.availableTemplates.push(...notExistingTemplates);
        await project.save();
    }
    
    return project;
};

const Project = mongoose.model('project', projectSchema);
module.exports = Project;

