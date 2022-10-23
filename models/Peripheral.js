import mongoose from "mongoose";

const PeripheralSchema = new mongoose.Schema(
  {
    uid: {
      type: Number,
      required: [true, "PLease provide uid"],
    },
    vendor: {
      type: String,
      required: [true, "Please provide vendor"],
    },
    date: {
      type: Date,
      required: [true, "Please provide date"],
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    gateway: {
      type: mongoose.Types.ObjectId,
      ref: "Gateway",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Peripheral", PeripheralSchema);
