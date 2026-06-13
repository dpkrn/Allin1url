const mongoose=require('mongoose')
const userProfileSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        ref: 'user'
    },
    name:{
        type:String,
        default:""
    },
    passion:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    location:{
        type:String,
        default:""
    },
    image:{
        type:String,
        default:"profile.jpg"
    },
    headline:{
        type:String,
        default:""
    },
    website:{
        type:String,
        default:""
    },
    skills:{
        type:[String],
        default:[]
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true // This adds createdAt and updatedAt automatically
})

const User=mongoose.model('userinfo',userProfileSchema)
module.exports=User;