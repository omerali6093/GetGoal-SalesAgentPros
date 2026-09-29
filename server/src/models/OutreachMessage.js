import mongoose from 'mongoose'
import { OUTREACH_CHANNELS } from '../config/constants.js'

const { Schema, model } = mongoose

const outreachMessageSchema = new Schema(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true,
    },
    lead: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
    },
    channel: {
      type: String,
      enum: OUTREACH_CHANNELS,
      required: true,
    },
    subject: {
      type: String,
      default: null, 
    },
    body: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'saved', 'sent'],
      default: 'draft',
    },
    generatedByAI: {
      type: Boolean,
      default: true,
    },
    refinedFrom: {
      type: Schema.Types.ObjectId,
      ref: 'OutreachMessage',
      default: null, 
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true },
)

outreachMessageSchema.index({ business: 1, channel: 1, createdAt: -1 })

export default model('OutreachMessage', outreachMessageSchema)