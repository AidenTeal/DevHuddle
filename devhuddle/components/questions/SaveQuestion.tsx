"use client"

import { toggleSaveQuestion } from '@/lib/actions/collection.action';
import { ActionResponse } from '@/types/global';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { use, useState } from 'react'
import { toast } from 'sonner';

interface Params {
    questionId: string;
    hasSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>>;
}

const SaveQuestion = ({ questionId, hasSavedQuestionPromise }: Params) => {
    const session = useSession();
    const userId = session?.data?.user?.id;

    const [isLoading, setIsLoading] = useState(false);

    const { data } = use(hasSavedQuestionPromise);
    
    const { saved: hasSaved } = data || {};

    const handleSave = async () => {
        if (isLoading) return;
        if (!userId) return toast("Please login to save questions", {
            description: "You need to be logged in to save questions.",
        });
        
        setIsLoading(true);
        
        try {
            const { success, data, error } = await toggleSaveQuestion({ questionId });
            
            if (!success) {
                throw new Error(error?.message || 'Failed to save question');
            }
            
            toast.success(`Question ${data?.saved ? 'saved' : 'unsaved'} successfully`, {
                description: data?.saved ? "You can find it in your saved questions." : "Question has been removed from your saved questions.",
            });    
        } catch (error) {
            toast(
                "Error", {
                    description: error instanceof Error ? error.message : 'An unexpected error occurred.',
                })
            } finally {
                setIsLoading(false);
            }
        }

    return (
    <Image 
        src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
        width={18}
        height={18}
        alt="Save Question"
        className={`cursor-pointer ${isLoading ? 'animate-pulse' : ''}`}
        aria-label="Save Question"
        onClick={handleSave}
    />
  )
}

export default SaveQuestion
