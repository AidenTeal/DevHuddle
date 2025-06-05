import { model, models, Schema, Types } from "mongoose";


export interface ITagQuestion {
    question: Types.ObjectId;
    tag: Types.ObjectId;
}

const TagQuestionSchema = new Schema<ITagQuestion>({
    question: { type: Schema.Types.ObjectId, required: true, ref: "Question"},
    tag: { type: Schema.Types.ObjectId, required: true, ref: "Tag"}
}, { timestamps: true });

const TagQuestion = models?.tagQuestion || model<ITagQuestion>("TagQuestion", TagQuestionSchema);

export default TagQuestion;