import { CreateInteractionParams } from "@/types/action";
import handleError from "../handlers/error";
import { ActionResponse, ErrorResponse } from "@/types/global";
import mongoose from "mongoose";
import action from "../handlers/action";
import { CreateInteractionSchema } from "../validation";
import { Interaction } from "@/database";
import { IInteractionDoc } from "@/database/interaction.model";

export async function createInteraction(
  params: CreateInteractionParams
): Promise<ActionResponse<IInteractionDoc>> {
  const validationResult = await action({
    params,
    schema: CreateInteractionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { authorId, action: actionType, actionId, actionTarget } = params;

  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const [interaction] = await Interaction.create(
      [
        {
          user: userId,
          action: actionType,
          actionId,
          actionType: actionTarget,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(interaction)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
