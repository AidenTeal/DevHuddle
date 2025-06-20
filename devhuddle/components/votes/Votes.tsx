"use client";

import { createVote } from "@/lib/actions/vote.action";
import { formatNumber } from "@/lib/utils";
import { HasVotedResponse } from "@/types/action";
import { ActionResponse } from "@/types/global";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { use, useState } from "react";
import { toast } from "sonner";

interface Params {
  upvotes: number;
  downvotes: number;
  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
  targetType: "question" | "answer";
  targetId: string;
}

const Votes = ({
  upvotes,
  downvotes,
  hasVotedPromise,
  targetType,
  targetId,
}: Params) => {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  const userId = session.data?.user?.id;

  const { success, data } = use(hasVotedPromise);

  const { hasUpvoted, hasDownvoted } = data || {};

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId) {
      return toast("Please login to vote", {
        description: "You need to be logged in to vote on this post.",
      });
    }

    setIsLoading(true);

    try {
      const result = await createVote({
        targetId,
        targetType,
        voteType,
      });

      if (!result.success) {
        toast.error("Failed to record your vote.", {
          description:
            result.error?.message ||
            "An error occurred while processing your vote.",
        });
      }

      const successMessage =
        voteType === "upvote"
          ? `Upvote ${!hasUpvoted ? "added" : "removed"} successfully`
          : `Downvote ${!hasDownvoted ? "added" : "removed"} successfully`;

      toast(successMessage, {
        description: "Your vote has been recorded.",
      });
    } catch (error) {
      toast.error("An error occurred while processing your vote.", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center gap-2.5 ">
      <div className="flex-center gap-1.5">
        <Image
          src={success && hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
          alt="Upvote Icon"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={success && hasDownvoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
          alt="DownVote Icon"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
