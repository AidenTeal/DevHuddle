"use client"

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/url";
import { useDebounce } from 'react-use';

type LocalSearchProps = {
    route: string,
    imgSrc: string,
    placeholder: string,
    otherClasses: string
}

const LocalSearch = ({route, imgSrc, placeholder, otherClasses}: LocalSearchProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";

    const [searchQuery, setSearchQuery] = useState(query);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(query);

    useDebounce(() => setDebouncedSearchQuery(searchQuery), 1000, [searchQuery])

    useEffect(() => {
        if (debouncedSearchQuery) {
            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'query',
                value: debouncedSearchQuery
            })

            router.push(newUrl, {scroll: false})
        } else {
            if (pathname === route) {
                const newUrl = removeKeysFromQuery({
                    params: searchParams.toString(),
                    keysToRemove: ["query"]
                });

                router.push(newUrl), {scroll: false}
            }
        }
    }, [debouncedSearchQuery, router, route, searchParams, pathname])

  return (
    <div className="background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4">
      <Image 
        src={imgSrc}
        width={24}
        height={24}
        alt="Search"
        className="cursor-pointer"
      />
      
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
      />
    </div>
  );
};

export default LocalSearch;
