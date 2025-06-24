import { ActionResponse, Answer } from '@/types/global'
import React from 'react'
import DataRenderer from '../DataRenderer';
import { EMPTY_ANSWERS } from '@/constants/states';
import AnswerCard from '../cards/AnswerCard';
import CommonFilter from '../filters/CommonFilter';
import { AnswerFilters } from '@/constants/filters';
import Pagination from '../Pagination';

interface Props extends ActionResponse<Answer[]> {
    totalAnswers: number;
    page: number;
    isNext: boolean;
}

const AllAnswers = ({ page, isNext, data, success, error, totalAnswers }: Props) => {
  return (
    <div className='mt-11'>
        <div className='flex items-center justify-between'>
            <h3 className='primary-text-gradient'>
                {totalAnswers == 1 ? totalAnswers + " Answer" : totalAnswers + " Answers"}
            </h3>
            <CommonFilter 
                filters={AnswerFilters}
                otherClasses="sm:min-w-32"
                containerClasses='max-xs:w-full'

            />
        </div>

        <DataRenderer 
            data={data}
            error={error}
            success={success}
            empty={EMPTY_ANSWERS}
            render={(data) => data.map((answer) => (
                <AnswerCard key={answer._id} {...answer} />
            ))}
        />

        <Pagination 
        page={page}
        isNext={isNext || false}
      />
    </div>
  )
}

export default AllAnswers
