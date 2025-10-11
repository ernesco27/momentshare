import { model, models, Schema, Types } from "mongoose";

export interface ITransaction {
  reference: string;
  email: string;
  planId: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  verifiedAt: Date;
  paymentProviderTransactionId?: string;
}

export interface IEventDoc extends ITransaction, Document {}

const TransactionSchema = new Schema<ITransaction>(
  {
    reference: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    verifiedAt: { type: Date },
    paymentProviderTransactionId: { type: String },
  },
  { timestamps: true }
);

const Transaction =
  models?.Transaction || model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
