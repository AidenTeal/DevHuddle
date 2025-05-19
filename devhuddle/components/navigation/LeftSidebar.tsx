import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavLinks from "./navbar/NavLinks";
import ROUTES from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/auth";


const LeftSidebar = async () => {
  const session = await auth();
  console.log(session);

  return (
    <section className='custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]'>
        <div className='flex flex-col min-sm:items-center h-[564px]'>
            <div>
                <section className='flex h-full flex-col gap-6'>
                    <NavLinks />
                </section>
            </div>
        </div>
        { !session ? (
            <div className='flex flex-col gap-3'>
                <Link href={ROUTES.SIGN_IN}>
                    <Button className='small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none cursor-pointer'>
                        <Image
                            src="/icons/user.svg"
                            alt="Account"
                            width={20}
                            height={20}
                            className="invert-colors lg:hidden"
                        />
                        <span className='primary-text-gradient max-lg:hidden'>Sign In</span>
                    </Button>
                </Link>
                <Link href={ROUTES.SIGN_UP}>
                    <Button className='small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none cursor-pointer'>
                        <Image
                            src="/icons/sign-up.svg"
                            alt="Account"
                            width={20}
                            height={20}
                            className="invert-colors lg:hidden"
                        />
                        <span className='max-lg:hidden'>Sign Up</span>
                    </Button>
                </Link>
            </div>
        ) : (
            <form 
                action={async () => {
                    "use server"
                    await signOut({redirectTo: ROUTES.SIGN_IN})
                    }}
                >
                <Button className='small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none cursor-pointer'>
                    <Image
                        src="/icons/logout.png"
                        alt="Account"
                        width={20}
                        height={20}
                        className="invert-colors"
                    />
                    <span className='primary-text-gradient max-lg:hidden'>Logout</span>
                </Button>
            </form>
            )
        }
    </section>
  );
};

export default LeftSidebar;
