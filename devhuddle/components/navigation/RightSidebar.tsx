import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TagCard from "../cards/TagCard";
import { getTags } from "@/lib/actions/tag.action";
import { EMPTY_TAGS } from "@/constants/states";
import DataRenderer from "../DataRenderer";
import { TagProps } from "@/types/global";
import { getHotQuestions } from "@/lib/actions/question.action";

const RightSidebar = async () => {
  const [
    { success, data, error },
    { success: hotQuestionsSuccess, data: hotQuestions },
  ] = await Promise.all([
    getTags({ page: 1, pageSize: 5, filter: "popular" }),
    getHotQuestions(),
  ]);

  const { tags = [] } = data || {};

  return (
    <section className="pt-36 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

        <DataRenderer
          data={hotQuestions}
          empty={{
            title: "No questions found",
            message: "No questions have been asked yet.",
          }}
          success={hotQuestionsSuccess}
          error={error}
          render={(hotQuestions) => (
            <div className="mt-7 flex w-full flex-col gap-[30px]">
              {hotQuestions.map(({ _id, title }) => (
                <Link
                  key={_id}
                  href={ROUTES.QUESTION(_id)}
                  className="flex cursor-pointer items-center justify-between gap-7"
                >
                  <p className="body-medium text-dark500_light700">{title}</p>

                  <Image
                    src="/icons/chevron-right.svg"
                    alt="Chevron"
                    width={20}
                    height={20}
                    className="invert-colors"
                  />
                </Link>
              ))}
            </div>
          )}
        />
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <DataRenderer
          success={success}
          error={error}
          data={tags}
          empty={EMPTY_TAGS}
          render={(tags) => (
            <div className="mt-7 flex flex-col gap-4">
              {tags.map((tag: TagProps) => (
                <TagCard
                  key={tag._id}
                  _id={tag._id}
                  name={tag.name}
                  questions={tag.questions}
                  showCount
                  compact
                />
              ))}
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default RightSidebar;
