import { model, models, Schema, Types } from "mongoose";
import User, { IUser } from "./user.model";
import { string } from "zod";



export interface IAccount {
    userId: Types.ObjectId;
    name: string;
    image?: string;
    password?: string;
    provider: string;
    providerAccountId: string;
}

const AccountSchema = new Schema<IAccount>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    image: { type: String },
    password: { type: String },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
}, { timestamps: true });

const Account = models?.account || model<IAccount>("Account", AccountSchema);

export default Account;