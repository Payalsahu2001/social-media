
const mongoose = require("mongoose")
const plm= require("passport-local-mongoose")

const userSchema = new mongoose.Schema({

    
        profilepic: {
            type: String,
            default: "default.png",
        },

    username: {
        type: String,
        trim: true,
        required: [true, " Name is required"],
        minLength: [4, "Name must be atleast 4 characters long"],
    },
    Email: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Email is required"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

    resetPasswordToken: {
        type: Number,
        default: 0,
    },

    password: String,
},
    { timestamps: true }
);

 userSchema.plugin(plm);

const user = mongoose.model("user", userSchema);

module.exports = user;