import mongoose, { isValidObjectId } from 'mongoose';


const { Schema, model } = mongoose;


const userScheme = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
        },

        passwordHash: {
            type: String,
            required: true,
            select: false,
        },

        agencyName: {
            type: String,
            trim: true,
            default: '',
        },
        role: {
            type: String,
            enum: ['admin', 'sale_rep'],
            default: 'admin'
        },
        isActive: {
            type: Boolean,
            default: true
        },
    },
    {timestamps: true},
)

export default model('User', userScheme)