import { auth } from '@/auth';
import QuestionForm from '@/components/forms/QuestionForm';
import ROUTES from '@/constants/routes';
import { getQuestion } from '@/lib/actions/question.action';
import { RouteParams } from '@/types/global';
import { notFound, redirect } from 'next/navigation';
import React from 'react'

const EditQuestion = async ({ params }: RouteParams) => {
  const session = await auth();
  if (!session) return redirect('/sign-in');

  const { id } = await params;

  if (!id) return notFound();

  const {data: question, success } = await getQuestion({ questionId: id });
  if (!success) return notFound();

  if (question?.author.toString() !== session?.user?.id) redirect(ROUTES.QUESTION(id));

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>
        Edit your question
      </h1>

      <div className='mt-9'>
        <QuestionForm question={question} isEdit />
      </div>
    </>
  )
}

export default EditQuestion;
