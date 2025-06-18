"use server";

import AnswerModel, { IAnswerDoc } from "@/database/answer.model";
import type { Answer } from "@/types/global";
import { CreateAnswerParams, GetAnswersParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import { AnswerServerSchema, GetAnswersSchema } from "../validation";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import { Question } from "@/database";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";

export async function createAnswer(
  params: CreateAnswerParams
): Promise<ActionResponse<IAnswerDoc>> {
  const validationResult = await action({
    params,
    schema: AnswerServerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { content, questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    const [newAnswer] = await AnswerModel.create(
      [
        {
          author: userId,
          question: questionId,
          content,
        },
      ],
      { session }
    );

    if (!newAnswer) throw new Error("Failed to create answer");

    question.answers += 1;
    await question.save({ session });

    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(questionId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newAnswer)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function getAnswers(params: GetAnswersParams): Promise<
  ActionResponse<{
    answers: Answer[];
    isNext: boolean;
    totalAnswers: number;
  }>
> {
    const validationResult = await action({
        params,
        schema: GetAnswersSchema
    });

     if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId, page = 1, pageSize = 10, filter } = validationResult.params!;
  
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  let sortCriteria = {};

  switch (filter) {
    case 'latest':
        sortCriteria = { createdAt: -1 }; // Newest first
        break;
    case 'oldest':
        sortCriteria = { createdAt: 1 }; // Oldest first
        break;
    case 'popular':
        sortCriteria = { upvotes: -1 }; // Most upvoted first
        break;
    default:
        sortCriteria = { createdAt: -1 }; // Default to newest first   
        break;
  }

  try {
    const totalAnswers = await AnswerModel.countDocuments({ question: questionId });

    const answers = await AnswerModel.find({ question: questionId }).populate("author",
        "_id name image"
    ).sort(sortCriteria)
    .skip(skip)
    .limit(limit);

    const isNext = totalAnswers > skip + answers.length;

    return {
        success: true,
        data: {
            answers: JSON.parse(JSON.stringify(answers)),
            isNext,
            totalAnswers
        }
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
