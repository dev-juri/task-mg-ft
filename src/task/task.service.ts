import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskInput } from './dtos/create-task-input';
import { TaskStatus } from './enums/taskStatus';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>
    ) { }

    async createTask(createTaskInput: CreateTaskInput): Promise<Task> {
        const task = this.taskRepository.create({
            ...createTaskInput,
            createdById: `random_merchant_id:${Date.now()}`,
        });
        return await this.taskRepository.save(task);
    }

    async updateTask(id: string, status: TaskStatus): Promise<Task> {
        const task = await this.taskRepository.findOneBy({ id });
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        task.status = status;
        return await this.taskRepository.save(task);
    }

    async getTasks(storeId: string, status?: TaskStatus): Promise<Task[]> {
        const tasks = await this.taskRepository.find({
            where: {
                storeId,
                status,
            },
            order: {
                createdAt: 'DESC',
            }
        });

        if (!tasks) {
            throw new NotFoundException(`No tasks found for store ID ${storeId}`);
        }

        return tasks;
    }
}
