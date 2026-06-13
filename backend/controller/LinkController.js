const LinkAnalytics = require("../model/linkAnalyticsModel");
const Link = require("../model/linkModel");
const crypto = require('crypto');

const addNewSource=async(req,res)=>{
    try{
        const userId=req.userId;
        console.log(userId)
       const {username,source,destination}=req.body
        if(!userId||!source||!username||!destination){
            return res.status(400).json({success:false,message:"All fields are required"})
        }
    
        // Normalize source to lowercase for consistency
        // This ensures all platform names are stored in lowercase regardless of input
        const normalizedSource = source.toLowerCase().trim();
        
        // Escape special regex characters to prevent regex injection
        const escapedSource = normalizedSource.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Use case-insensitive query to check for duplicates
        // This prevents creating duplicates with different casing (e.g., "LinkedIn" vs "linkedin")
        const sourceExist = await Link.findOne({
            userId,
            username,
            source: { $regex: new RegExp(`^${escapedSource}$`, 'i') }
        });
        
        if(sourceExist){
            return res.status(409).json({success:false,message:`${normalizedSource} already exists !`})
        }
        
        // Generate unique linkId
        const linkId = crypto.randomBytes(16).toString('hex');
        
        // Store normalized source to ensure consistency
        const doc=await Link.create({userId,username,source:normalizedSource,destination,linkId})
       
        if(doc)
        return res.status(201).json({success:true,message:`${normalizedSource} added !`,link:doc})

    }catch(err){
        console.log(err,"error")
        return res.status(500).json({success:false,message:"Server Internal Erro !"})
    }
}


const getAllSource=async(req,res)=>{
    try{
        const userId=req.userId;
        const {username}=req.body
         if(!userId||!username){
             return res.status(400).json({success:false,message:"looks like you entered link directely ! please login first"})
         }
     
         const sources=await Link.find({username,userId,deletedAt:null},{source:1,destination:1,clicked:1,notSeen:1,visibility:1,linkId:1,updatedAt:1});
         if(!sources)
         return res.status(404).json({success:false,message:'sources not found !'})
         return res.status(200).json({success:true,message:'sources fetched successfully',sources})
 
     }catch(err){
         console.log(err,"error")
         return res.status(500).json({success:false,message:"Server Internal Error"})
     }
    }
const deleteLink=async(req,res)=>{
    try{
        if(!req.userId){
            return res.status(404).json({success:false,message:"Login first. token expired !"})
        }
       const id=req.body.id
       if(!id){
        return res.status(404).json({success:false,message:"link already deleted !"})
       }
     
         const link=await Link.findByIdAndDelete(id);
         if(!link)
         return res.status(404).json({success:false,message:'Not found!'})
         
         return res.status(200).json({success:true,message:"link has been deleted successfully"})
 
     }catch(err){
         console.log(err)
         return res.status(500).json({success:false,message:"Server Internal Error"})
     }
    }

    const setNotificationToZero=async(req,res)=>{
        try{
            const userId=req.userId;
            console.log('updating')
            await Link.updateMany({userId},{$set:{notSeen:0}});

            console.log('updating')
            await LinkAnalytics.updateMany({userId,seen:false},{$set:{seen:true}});
            return res.status(201).json({success:true})
        }catch(err){
            console.log(err);
            return res.status(500).json({success:false,message:"Server Internal Error"})
        }
    }

    const editLink=async(req,res)=>{
        try{
            if(!req.userId){
                return res.status(401).json({success:false,message:"Login first. token expired !"})
            }
            const {id, source, destination} = req.body;
            if(!id){
                return res.status(400).json({success:false,message:"Link ID is required"})
            }
            
            const link = await Link.findById(id);
            if(!link){
                return res.status(404).json({success:false,message:"Link not found!"})
            }
            
            // Verify the link belongs to the user
            if(link.userId.toString() !== req.userId.toString()){
                return res.status(403).json({success:false,message:"You don't have permission to edit this link"})
            }
            
            // Normalize source to lowercase for consistency
            // Frontend sends lowercase, but database may have mixed-case from earlier operations
            const normalizedSource = source ? source.toLowerCase().trim() : null;
            const normalizedLinkSource = link.source.toLowerCase().trim();
            
            // If source is being changed, check for duplicates (excluding current link)
            // Use case-insensitive query to prevent duplicates regardless of casing
            if(normalizedSource && normalizedSource !== normalizedLinkSource){
                // Escape special regex characters to prevent regex injection
                const escapedSource = normalizedSource.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                
                const sourceExist = await Link.findOne({
                    userId: req.userId,
                    username: link.username,
                    source: { $regex: new RegExp(`^${escapedSource}$`, 'i') },
                    _id: { $ne: id } // Exclude the current link being edited
                });
                
                if(sourceExist){
                    return res.status(409).json({success:false,message:`${normalizedSource} already exists! Please choose a different platform name.`})
                }
            }
            
            // Update the link
            const updateData = {};
            if(normalizedSource) updateData.source = normalizedSource;
            if(destination) updateData.destination = destination;
            
            const updatedLink = await Link.findByIdAndUpdate(
                id,
                {$set: updateData},
                {new: true}
            );
            
            return res.status(200).json({
                success:true,
                message:"Link has been updated successfully",
                link:updatedLink
            })
        }catch(err){
            console.log(err);
            return res.status(500).json({success:false,message:"Server Internal Error"})
        }
    }

const updateVisibility = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const { id, visibility, password } = req.body;

        if (!id || !visibility) {
            return res.status(400).json({
                success: false,
                message: "Link ID and visibility are required"
            });
        }

        // Validate visibility value
        if (!['public', 'unlisted', 'private'].includes(visibility)) {
            return res.status(400).json({
                success: false,
                message: "Invalid visibility value. Must be 'public', 'unlisted', or 'private'"
            });
        }

        // Find the link
        const link = await Link.findById(id);
        if (!link) {
            return res.status(404).json({
                success: false,
                message: "Link not found"
            });
        }

        // Verify the link belongs to the user
        if (link.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to update this link"
            });
        }

        // Prepare update data
        const updateData = { visibility };

        // Handle password for private links
        if (visibility === 'private') {
            if (!password) {
                return res.status(400).json({
                    success: false,
                    message: "Password is required for private links"
                });
            }
            // Hash password using bcryptjs (consistent with AuthController)
            const bcryptjs = require('bcryptjs');
            const hashedPassword = await bcryptjs.hash(password, 10);
            updateData.password = hashedPassword;
        } else {
            // Clear password for public and unlisted links
            updateData.password = null;
        }

        // Update the link
        const updatedLink = await Link.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Link visibility updated successfully",
            link: updatedLink
        });
    } catch (err) {
        console.log("Update visibility error:", err);
        return res.status(500).json({
            success: false,
            message: "Server internal error"
        });
    }
};

module.exports={
    addNewSource,
    getAllSource,
    deleteLink,
    setNotificationToZero,
    editLink,
    updateVisibility,
}