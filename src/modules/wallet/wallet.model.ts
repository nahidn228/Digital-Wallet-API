import { model, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";

const walletSchema = new Schema<IWallet>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, default: 0 },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: {
        values: ["Active", "Blocked", "Suspended"],
        message: "{VALUE} is not acceptable",
      },
      required: true,
    },
    pin: { type: String, select: false },
  },
  { timestamps: true, versionKey: false }
);

const Wallet = model<IWallet>("Wallet", walletSchema);

export default Wallet;
