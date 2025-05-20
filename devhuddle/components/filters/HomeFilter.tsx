"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useQueryState } from 'nuqs'

const filters = [
    {
        name: "All", value: ""
    },
    {
        name: "Newest", value: "newest"
    },
    {
        name: "Popular", value: "popular"
    },
    {
        name: "Unanswered", value: "unanswered"
    },
    {
        name: "Recommended", value: "recommended"
    },
    {
        name: "React", value: "react"
    },
    {
        name: "Javascript", value: "javascript"
    },
]

const HomeFilter = () => {
    const searchParams = useSearchParams();
    const filterParams = searchParams.get("filter");
    const [active, setActive] = useState("");

    const [searchQuery, setSearchQuery] = useQueryState("filter", { defaultValue: "", shallow: false})

    const handleTypeClick = (filter: string) => {
        if(filter === active) {
            setActive("");
            setSearchQuery("");
        } else {
            setActive(filter);
            setSearchQuery(filter);
        }
    }

  return (
    <div className='mt-10 hidden flex-wrap gap-3 sm:flex'>
      {filters.map((filter) => (
        <Button key={filter.name} className={cn(`body-medium rounded-lg px-6 py-3 capitalize shadow-none hover:cursor-pointer`, active === filter.value ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400" : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300 ")}
            onClick={(e) => handleTypeClick(filter.value)}
        >
            {filter.name}
        </Button>
      ))}
    </div>
  )
}

export default HomeFilter
