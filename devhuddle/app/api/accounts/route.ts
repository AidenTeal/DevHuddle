import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ForbiddenError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();

        const accounts = await Account.find();

        return NextResponse.json({ success: true, data: accounts }, { status: 200 });
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

// Create User in the database
export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const validatedData = AccountSchema.parse(body);

        // check if account already exists
        const existingAccount = await Account.findOne(
            { 
                provider: validatedData.provider, 
                providerId: validatedData.providerAccountId 
            }
        );

        if (existingAccount) {
            throw new ForbiddenError("An account with the same provider already exists");
        }

        const newAccount = await Account.create(validatedData);

        return NextResponse.json({ success: true, data: newAccount }, { status: 201 });
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}