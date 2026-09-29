import mongoose from "mongoose";

import { INDUSTRIES, WEBSITE_STATUSES, LEAD_STATUSES } from '../config/constants.js'

const { Schema, model } = mongoose;

const scoresSchema = new Schema(
    {
        performance:
        {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        mobile: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        seo:
        {
            type: Number,
            min: 0,
            max: 100,
            default: 0

        },
        accessibility: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        conversion:
        {
            type: Number,
            min: 0,
            max: 100,
            default: 0

        },
    },
    { _id: false },
);


const socialSchema = new Schema(
    {
        facebook: {
            type: Boolean,
            default: false,
        },
        instagram: {
            type: Boolean,
            default: false,
        },
        linkedin: {
            type: Boolean,
            default: false,
        },
    }
)

const businessSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        industry: {
            type: String,
            enum: INDUSTRIES,
            required: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        owner: {
            type: String,
            trim: true,
            default: '',
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        website: {
            type: String,
            trim: true,
            default: null, // "No Website" status
        },
        websiteStatus: {
            type: String,
            enum: WEBSITE_STATUSES,
            default: 'No Website',
        },

        reviews: { type: Number, default: 0, min: 0 },
        rating: { type: Number, default: 0, min: 0, max: 5 },

        opportunityScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
            index: true,
        },
        leadStatus: {
            type: String,
            enum: LEAD_STATUSES,
            default: 'New',
            index: true,
        },

        scores: { type: scoresSchema, default: () => ({}) },
        technology: { type: String, default: 'None' },
        social: { type: socialSchema, default: () => ({}) },

        // Cached AI-generated insight (Phase 7/8) so BusinessDetails/LeadDetails
        // pages don't re-trigger an LLM call on every page load.
        aiInsight: { type: String, default: null },
        aiInsightGeneratedAt: { type: Date, default: null },

        campaign: {
            type: Schema.Types.ObjectId,
            ref: 'Campaign',
            default: null,
        },

        lastActivity: { type: Date, default: Date.now },
        discoveredAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
)

businessSchema.index({ industry: 1, location: 1 })
businessSchema.index({ websiteStatus: 1 })
businessSchema.index({ name: text })

export default model("Business", businessSchema     )