import { registerEnumType } from "@nestjs/graphql";

export enum TaskPriority {
    LOW,
    MEDIUM,
    HIGH,
}

registerEnumType(TaskPriority, {
    name: 'TaskPriority',
});
