import { Field, InputType, ID } from "@nestjs/graphql";
import { TaskPriority } from "../enums/taskPriority";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";

@InputType()
export class CreateTaskInput {

    @Field()
    @IsString({ message: 'Title must be a string' })
    @IsNotEmpty({ message: 'Title must not be empty' })
    @Transform(({ value }) => value?.trim())
    title: string;

    @Field({ nullable: true })
    @IsString({ message: 'Description must be a string' })
    description?: string;

    @Field(type => TaskPriority)
    @IsEnum(TaskPriority, { message: 'Priority must be a valid enum value' })
    priority: TaskPriority;

    @Field(type => ID)
    storeId: string;
}