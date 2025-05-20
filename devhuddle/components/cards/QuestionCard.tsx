import ROUTES from '@/constants/routes'
import Link from 'next/link'
import React from 'react'
import TagCard from './TagCard'
import Metric from '../Metric'

const QuestionCard = ({question}: QuestionCardProps) => {
  return (
    <div className='card-wrapper rounded-[10px] p-9 sm:px-11 background-light800_darkgradient'>
      <div className='flex flex-col-reverse justify-between items-start gap-5 sm:flex-row'>
        <div>
            <span className='subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'>{question.createdAt.toDateString()}</span>

            <h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>
                <Link
                    href={ROUTES.QUESTION(question._id)}
                >
                    {question.title}
                </Link>
            </h3>
        </div>
      </div>

      <div className='mt-3.5 flex w-full flex-wrap gap-2'>
        {question.tags.map((tag) => (
            <TagCard 
                key={tag._id} 
                _id={tag._id}
                name={tag.name}
                compact
            />
        ))}
      </div>

      <div className='flex-between mt-6 w-full flex-wrap gap-3'>
        <Metric 
            imgUrl={question.author.image}
            alt={question.author.name}
            value={question.author.name}
            title={`• asked ${question.createdAt.toDateString()}`}
            href={ROUTES.PROFILE(question.author._id)}
            textStyles="body-medium text-dark400_light700"
            isAuthor
        />

        <div className='flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start'>
            <Metric 
                imgUrl="/icons/like.svg"
                alt="like"
                value={question.upvotes}
                title=" Votes"
                textStyles="small-medium text-dark400_light800"
            />
            <Metric 
                imgUrl="/icons/message.svg"
                alt="answers"
                value={question.answers}
                title=" Answers"
                textStyles="small-medium text-dark400_light800"
            />
            <Metric 
                imgUrl="/icons/eye.svg"
                alt="views"
                value={question.views}
                title=" Views"
                textStyles="small-medium text-dark400_light800"
            />
        </div>
      </div>
    </div>
  )
}

export default QuestionCard
