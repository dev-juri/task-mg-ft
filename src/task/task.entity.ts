import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TaskStatus } from "./enums/taskStatus";
import { TaskPriority } from "./enums/taskPriority";

@Entity()
@ObjectType()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    @Field(type => ID)
    id: string;

    @Column({ length: 200 })
    @Field()
    title: string;

    @Column({ type: 'text', nullable: true })
    @Field({ nullable: true })
    description?: string;

    @Column({
        type: 'simple-enum',
        enum: TaskStatus,
        default: TaskStatus.TODO
    })
    @Field(type => TaskStatus)
    status: TaskStatus;

    @Column({
        type: 'simple-enum',
        enum: TaskPriority
    })
    @Field(type => TaskPriority)
    priority: TaskPriority;

    @Column({ type: 'uuid' })
    @Field(type => ID)
    storeId: string;

    @Column({ type: 'uuid' })
    @Field(type => ID)
    createdById: string;

    @CreateDateColumn()
    @Field()
    createdAt: Date;

    @UpdateDateColumn()
    @Field()
    updatedAt: Date;
}