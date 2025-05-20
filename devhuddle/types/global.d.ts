type Question = {
    _id: string; 
    title: string; 
    description: string; 
    tags: Tag[]; 
    author: Author
    upvotes: number; 
    answers: number; 
    views: number; 
    createdAt: Date; 
}

type Tag = {
    _id: string; 
    name: string;  
}
type Author = {
    _id: string; 
    name: string;
    image: string;
}

type QuestionCardProps = {
    key: string,
    question: Question
}