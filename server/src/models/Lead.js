import mongoose from "mongoose"
import { LEAD_STATUSES } from '../config/constants.js'

const { Schema, model } = mongoose;


const stageHistoryEntrySchema = new Schema(
  {
    stage: { type: String, enum: LEAD_STATUSES, required: true },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { _id: false },
)


const leadSchema = new Schema(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true,
    },
    stage: {
      type: String,
      enum: LEAD_STATUSES,
      default: 'New',
      index: true,
    },
    opportunityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    stageHistory: {
      type: [stageHistoryEntrySchema],
      default: () => [{ stage: 'New', changedAt: new Date() }],
    },
  },
  { timestamps: true },
)


leadSchema.index({ stage: 1, opportunityScore: -1 });

export default model("Lead", leadSchema)