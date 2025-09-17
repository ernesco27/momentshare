import { model, models, Schema, Types } from "mongoose";

export interface ITransaction {
  accountId: Types.ObjectId;
  planId: Types.ObjectId;
  amount: number;
  currency: "GHS";
  status: "PENDING" | "SUCCESS" | "FAILED";
  reference: string;
}

export interface IEventDoc extends ITransaction, Document {}

const TransactionSchema = new Schema<ITransaction>(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    reference: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Transaction =
  models?.Transaction || model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
