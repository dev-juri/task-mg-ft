import { Args, Mutation, Resolver, Query, ID } from '@nestjs/graphql';
import { Task } from './task.entity';
import { TaskStatus } from './enums/taskStatus';
import { TaskService } from './task.service';
import { CreateTaskInput } from './dtos/create-task-input';

@Resolver(of => Task)
export class TaskResolver {
    constructor(
        private readonly taskService: TaskService
    ) { }

    @Query(returns => [Task])
    getTasks(
        @Args('storeId', { type: () => ID }) storeId: string,
        @Args('status', { type: () => TaskStatus, nullable: true }) status?: TaskStatus,
    ): Promise<Task[]> {
        return this.taskService.getTasks(storeId, status);
    }

    @Mutation(returns => Task)
    createTask(@Args('createTaskInput') input: CreateTaskInput): Promise<Task> {
        return this.taskService.createTask(input)
    }

    @Mutation(returns => Task)
    updateTask(
        @Args('id') id: string,
        @Args('status', { type: () => TaskStatus }) status: TaskStatus
    ): Promise<Task> {
        return this.taskService.updateTask(id, status);
    }
}
