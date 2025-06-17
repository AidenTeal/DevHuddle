import ROUTES from '@/constants/routes'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type UserAvatarProps = {
    id: string;
    name: string;
    imageUrl?: string | null;
    className?: string;
    fallbackClassName?: string;
}

const UserAvatar = ({id, name, imageUrl, className = "h-9 w-9", fallbackClassName}: UserAvatarProps) => {
    const initials = name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');


  return (
    <Link href={ROUTES.PROFILE(id)}>
        <Avatar className={className}>
            {imageUrl ? (
                <Image 
                    src={imageUrl}
                    alt={name}
                    className='object-cover'
                    width={36}
                    height={36}
                    quality={100}
                />
            ) : (
                <AvatarFallback className={cn('primary-gradient font-space-grotesk font-bold tracking-wider text-white', fallbackClassName)}>
                    {initials}
                </AvatarFallback>
            )}

        </Avatar>
    </Link>
  )
}

export default UserAvatar
