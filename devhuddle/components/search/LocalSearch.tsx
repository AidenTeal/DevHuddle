"use client"

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/url";
import { useDebounce } from 'react-use';
import { parseAsInteger, useQueryState } from "nuqs";

type LocalSearchProps = {
    route: string,
    imgSrc: string,
    placeholder: string,
    otherClasses: string
}

const LocalSearch = ({route, imgSrc, placeholder, otherClasses}: LocalSearchProps) => { 
    const [searchQuery, setSearchQuery] = useQueryState("query", { defaultValue: "", shallow: false})
    
    const [searchVal, setSearchVal] = useState("");

    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

    useDebounce(() => setDebouncedSearchQuery(searchVal), 500, [searchVal])

    useEffect(() => {
        setSearchQuery(debouncedSearchQuery);
    }, [debouncedSearchQuery, setSearchQuery])

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
        value={searchVal}
        onChange={(e) => setSearchVal(e.target.value)}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
      />
    </div>
  );
};

export default LocalSearch;
