import { model, models, Schema, Types } from "mongoose";

export interface ITransaction {
  reference: string;
  email: string;
  planId: Types.ObjectId;
  accountId: Types.ObjectId;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  verifiedAt: Date;
}

export interface IEventDoc extends ITransaction, Document {}

const TransactionSchema = new Schema<ITransaction>(
  {
    reference: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

const Transaction =
  models?.Transaction || model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
