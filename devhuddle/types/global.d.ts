import { NextResponse } from "next/server";
import { StringValidation } from "zod";

type Question = {
    _id: string; 
    title: string;
    content: string; 
    description: string; 
    tags: Tag[]; 
    author: Author
    upvotes: number; 
    downvotes: number;
    answers: number; 
    views: number; 
    createdAt: Date; 
}

type Tag = {
    _id: string; 
    name: string;  
}
type Author = {
    _id: string; 
    name: string;
    image: string;
}

type QuestionCardProps = {
    key: string;
    question: Question
}

type ActionResponse<T = null> = {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        details?: Record<string, string[]>;
    };
    status?: number;
}

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

type RouteParams = {
    params: Promise<Record<string, string>>; 
    searchParams: Promise<Record<string, string>>;
}

type PaginatedSearchParams = {
    page?: number;
    pageSize?: number;
    query?: string;
    filter?: string;
    sort?: string;
}

type TagProps = {
    _id: string,
    name: string,
    questions?: number,
    showCount?: boolean,
    compact?: boolean,
    remove?: boolean,
    isButton?: boolean,
    handleRemove?: () => void,
}

interface Answer {
    _id: string;
    author: Author;
    content: string;
    createdAt: Date;
    upvotes: number;
    downvotes: number;
}

interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    bio?: string;
    image?: string;
    location?: string;
    portfolio?: string;
    reputation?: number;
}