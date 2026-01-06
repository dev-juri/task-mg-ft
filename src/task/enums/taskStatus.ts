import { registerEnumType } from "@nestjs/graphql";

export enum TaskStatus {
    TODO,
    IN_PROGRESS,
    DONE
}

registerEnumType(TaskStatus, {
    name: 'TaskStatus',
});