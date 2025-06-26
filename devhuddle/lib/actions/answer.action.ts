"use server";

import AnswerModel, { IAnswerDoc } from "@/database/answer.model";
import type { Answer } from "@/types/global";
import {
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import {
  AnswerServerSchema,
  DeleteAnswerSchema,
  GetAnswersSchema,
} from "../validation";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import { Question, Vote } from "@/database";
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
    schema: GetAnswersSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    questionId,
    page = 1,
    pageSize = 10,
    filter,
  } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  let sortCriteria = {};

  switch (filter) {
    case "latest":
      sortCriteria = { createdAt: -1 }; // Newest first
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 }; // Oldest first
      break;
    case "popular":
      sortCriteria = { upvotes: -1 }; // Most upvoted first
      break;
    default:
      sortCriteria = { createdAt: -1 }; // Default to newest first
      break;
  }

  try {
    const totalAnswers = await AnswerModel.countDocuments({
      question: questionId,
    });

    const answers = await AnswerModel.find({ question: questionId })
      .populate("author", "_id name image")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteAnswer(
  params: DeleteAnswerParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { answerId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  try {
    // Lets think: An Answer is stand still. It contains IDs of users, questions, and the content, but is not contained in any other documents.
    // Only thing I will need to do is to delete the answer and update the question's answer count.

    // So: 1. Get questionId from the Answer
    // 2. Delete any votes related to the answer
    // 3. Update the question's answer count
    // 4. Delete the answer

    const answer = await AnswerModel.findById(answerId);

    if (userId !== answer?.author.toString()) {
      throw new Error("You are not authorized to delete this answer");
    }

    // Validated that user is the author of the answer, proceed to delete
    const questionId = answer.question;

    // Delete votes related to the answer
    await Vote.deleteMany({ actionId: answerId, targetType: "answer" });

    // Decrement question count by one
    await Question.findByIdAndUpdate(
      questionId,
      { $inc: { answers: -1 } },
      { new: true }
    );

    await AnswerModel.findByIdAndDelete(answerId);

    revalidatePath(`/profile/${userId}`);

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
