import { auth, signOut } from "@/auth"
import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { AvatarImage } from "@/constants/avatars";
import ROUTES from "@/constants/routes";
import Link from "next/link";


type SearchParams = {
  searchParams: Promise<{ [key: string]: string }>
}

const questions: Question[] = [
  {
    _id: "1",
    title: "How to learn React?",
    description: "I want to learn React, can anyone help me?",
    tags: [
      { _id: "1", name: "React" },
    ],
    author: { _id: "1", name: "John Doe", image: AvatarImage },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "How to learn JavaScript?",
    description: "I want to learn JavaScript, can anyone help me?",
    tags: [
      { _id: "1", name: "JavaScript" },
    ],
    author: { _id: "1", name: "John Doe", image: AvatarImage},
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date(),
  },
];

const Home = async ({ searchParams }: SearchParams) => {
  const session = await auth();
  console.log(session);

  const { query = "", filter = "" } = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    const matchedQuery = query ? question.title?.toLowerCase().includes(query.toLowerCase()) : true;

    const matchedFilter = filter ? question.tags.some((tag) => (
      tag.name?.toLowerCase() === filter.toLowerCase()
    )) : true;

    return matchedQuery && matchedFilter;
  });

  return (
    <>
      <section className="flex w-full flex-col-reverse sm:flex-row gap-4 justify-between sm:items-center">
        <h1 className="h1-bold text-dark100_light900">
          All Questions
        </h1>

        <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900" asChild>
          <Link href={ROUTES.ASK_QUESTION}>
            Ask a Question
          </Link>
        </Button>
      </section>

      <section className="mt-11">
        <LocalSearch 
          route="/"
          imgSrc='/icons/search.svg'
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>
      <HomeFilter />

      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard
            key={question._id}
            question={question}
          />
        ))}
      </div>
    </>
  );
}

export default Home