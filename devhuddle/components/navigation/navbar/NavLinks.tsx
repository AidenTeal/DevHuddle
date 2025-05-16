"use client";

import { sidebarLinks } from '@/constants'
import { homedir } from 'os'
import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { SheetClose } from '@/components/ui/sheet';

export const NavLinks = ({isMobileNav = false}: { isMobileNav?: boolean }) => {
    const pathName = usePathname();

    // placeholder userID for now
    const userId = 1;

  return (
    <>
        {sidebarLinks.map((item) => {
            const isActive = (pathName.includes(item.route) && item.route.length > 1) || pathName === item.route;

            if (item.route === '/profile') {
                if (userId) {
                    item.route = `${item.route}/${userId}`;
                } else {
                    return null;
                }
            }

            const LinkComponent = (
                <Link 
                    href={item.route} 
                    key={item.label}
                    className={cn(isActive ? 'primary-gradient rounded-lg text-light-900' : 'text-dark-300_light900', 'flex items-center justify-start gap-4 bg-transparent p-4')}
                >
                    <Image 
                        src={item.imgURL}
                        alt={item.label}
                        width={20}
                        height={20}
                        className={cn({"invert-colors": !isActive})}
                    />
                    <p className={cn(isActive ? 'base-bold' : 'base-medium', !isMobileNav && 'max-lg:hidden')}>{item.label}</p>
                </Link>
            )

            return isMobileNav ? (
                <SheetClose asChild key={item.route}>
                    {LinkComponent}
                </SheetClose>
            ) : (
                <div key={item.route}>
                    {LinkComponent}
                </div>
            )
        })}
    </>
  )
}

export default NavLinks
