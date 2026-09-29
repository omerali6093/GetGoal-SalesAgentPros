import mongoose from "mongoose"
import Business from "./Business"

const { Schema, model } = mongoose


const websiteAuditSchema = new Schema(
    {
        business: {
            type: Schema.Types.ObjectId,
            ref: "Business",
            required: true,
            index: true
        },

        url: {
            type: String,
            trim: true,
            default: null,
        },

        scores: {
            performance: { type: Number, min: 0, max: 100, default: 0 },
            mobile: { type: Number, min: 0, max: 100, default: 0 },
            seo: { type: Number, min: 0, max: 100, default: 0 },
            accessibility: { type: Number, min: 0, max: 100, default: 0 },
            conversion: { type: Number, min: 0, max: 100, default: 0 },
        },

        overallScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },

        technology: {
            type: String,
            default: 'Unknown',
        },

        issues: {
            type: [String],
            default: [],
        },

        rawReport: {
            type: Schema.Types.Mixed,
            default: null,
        },

        auditedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {timestamps: true}
)

websiteAuditSchema.index({ business: 1, auditedAt: -1 })

export default model("WebsiteAudit", websiteAuditSchema);

