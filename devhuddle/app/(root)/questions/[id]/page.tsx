import AllAnswers from "@/components/answers/AllAnswers";
import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import { Question } from "@/database";
import { getAnswers } from "@/lib/actions/answer.action";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { RouteParams } from "@/types/global";
import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import React from "react";

const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;
  
  const { success, data } = await getQuestion({
    questionId: id
  });
  
  after(async () => await incrementViews({ questionId: id}));
  


  if (!success || !data) return redirect("/404");

  const { success: successAnswer, data: answersResult, error: answersError } = await getAnswers({
    questionId: id,
    page: 1,
    pageSize: 10,
    filter: "latest",
  });

  const sampleQuestion = data;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={sampleQuestion.author._id}
              name={sampleQuestion.author.name}
              imageUrl={sampleQuestion.author.image}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />

            <Link href={ROUTES.PROFILE(sampleQuestion.author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {sampleQuestion.author.name}
              </p>
            </Link>
          </div>

          <div className="flex justify-end">
            <p>Votes</p>
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {sampleQuestion.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(new Date(sampleQuestion.createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={sampleQuestion.answers}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(sampleQuestion.views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>

     
      <Preview content={sampleQuestion.content} />
      
      <div className="mt-8 flex flex-wrap gap-2">
        {sampleQuestion.tags.map((tag) => (
          <TagCard
            key={tag._id}
            _id={tag._id as string}
            name={tag.name}
            compact
          />
        ))}
      </div>

      <section className="my-5">
        <AllAnswers 
          data={answersResult?.answers}
          success={successAnswer}
          error={answersError}
          totalAnswers={answersResult?.totalAnswers || 0}
        />
      </section>

      <section className="my-5">
        <AnswerForm questionId={data._id} questionTitle={data.title} questionContent={data.content}/>
      </section>
    </>
  );
};

export default QuestionDetails;
