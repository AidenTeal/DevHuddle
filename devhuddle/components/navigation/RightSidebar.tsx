import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TagCard from "../cards/TagCard";
import { getTags } from "@/lib/actions/tag.action";
import { EMPTY_TAGS } from "@/constants/states";
import DataRenderer from "../DataRenderer";
import { TagProps } from "@/types/global";

const hotQuestions = [
  {
    _id: "1",
    title: "How to create a custom hook in React?",
  },
  {
    _id: "2",
    title: "What is the difference between useState and useReducer?",
  },
  {
    _id: "3",
    title: "How to manage global state in React?",
  },
  {
    _id: "4",
    title: "What is the purpose of useEffect hook?",
  },
  {
    _id: "5",
    title: "How to optimize performance in React applications?",
  },
];

const RightSidebar = async () => {
  const { success, data, error } = await getTags({
    page: 1,
    pageSize: 5,
    filter: "popular",
  });

  const { tags = [] } = data || {};

  return (
    <section className="pt-36 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map(({ _id, title }) => (
            <Link
              key={_id}
              href={ROUTES.PROFILE(_id)}
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
