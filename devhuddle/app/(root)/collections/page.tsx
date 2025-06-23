import { auth, signOut } from "@/auth"
import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { AvatarImage } from "@/constants/avatars";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION, EMPTY_QUESTIONS_SAVED } from "@/constants/states";
import { getSavedQuestions } from "@/lib/actions/collection.action";
import { getQuestions } from "@/lib/actions/question.action";
import { Question } from "@/types/global";
import Link from "next/link";


type SearchParams = {
  searchParams: Promise<{ [key: string]: string }>
}

const Collections = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getSavedQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { collection } = data || {};

  return (
    <>
      <section className="flex w-full flex-col-reverse sm:flex-row gap-4 justify-between sm:items-center">
        <h1 className="h1-bold text-dark100_light900">
          Saved Questions
        </h1>
      </section>

      <section className="mt-11">
        <LocalSearch 
          route="/"
          imgSrc='/icons/search.svg'
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>

      <DataRenderer 
        success={success}
        error={error}
        data={collection}
        empty={EMPTY_QUESTIONS_SAVED}
        render={(collection) =>
          <div className="mt-10 flex w-full flex-col gap-6">
            {collection.map((item) => (
                <QuestionCard
                  key={item._id}
                  question={item.question}
                />
              ))}
          </div>
        }
      />
    </>
  );
}

export default Collections