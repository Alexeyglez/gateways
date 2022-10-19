import mongoose from "mongoose";

const GatewaySchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      unique: true,
      required: [true, "PLease provide serial number"],
    },
    gatewayName: {
      type: String,
      required: [true, "PLease provide serial name"],
    },
    address: {
      type: String,
      required: [true, "PLease provide serial address"],
    },
    peripheralDevice: [{ type: mongoose.Types.ObjectId, ref: "Peripheral" }],
  },
  { timestamps: true }
);

export default mongoose.model("Gateway", GatewaySchema);
