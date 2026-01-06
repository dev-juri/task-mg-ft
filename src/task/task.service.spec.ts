import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { TaskStatus } from './enums/taskStatus';
import { TaskPriority } from './enums/taskPriority';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskInput } from './dtos/create-task-input';

describe('TaskService', () => {
  let service: TaskService;
  let repository: Repository<Task>;

  const mockTask: Task = {
    id: 'some-uuid',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    storeId: 'store-uuid',
    createdById: 'user-uuid',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should successfully create a valid task', async () => {
      const createInput: CreateTaskInput = {
        title: 'New Task',
        description: 'Description',
        priority: TaskPriority.HIGH,
        storeId: 'store-1',
      };

      const expectedTask = { ...mockTask, ...createInput };

      mockRepository.create.mockReturnValue(expectedTask);
      mockRepository.save.mockResolvedValue(expectedTask);

      const result = await service.createTask(createInput);

      expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        title: createInput.title,
        priority: createInput.priority,
        storeId: createInput.storeId
      }));
      expect(mockRepository.save).toHaveBeenCalledWith(expectedTask);
      expect(result).toEqual(expectedTask);
    });
  });

  describe('updateTask', () => {
    it('should throw NotFoundException if task not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.updateTask('invalid-id', TaskStatus.DONE))
        .rejects
        .toThrow(NotFoundException);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 'invalid-id' });
    });

    it('should successfully update task', async () => {
      const id = mockTask.id
      const newStatus = TaskStatus.IN_PROGRESS

      const expectedTask = {
        ...mockTask,
        status: newStatus
      }

      mockRepository.findOneBy.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue(expectedTask);

      const result = await service.updateTask(id, newStatus);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(mockRepository.save).toHaveBeenCalledWith(expectedTask);
      expect(result).toEqual(expectedTask);
    })
  });

  describe('getTasks', () => {
    it('should filter tasks by status', async () => {
      const storeId = 'store-uuid';
      const status = TaskStatus.IN_PROGRESS;
      const tasks = [mockTask];

      mockRepository.find.mockResolvedValue(tasks);

      const result = await service.getTasks(storeId, status);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          storeId,
          status
        },
        order: {
          createdAt: 'DESC'
        }
      });
      expect(result).toEqual(tasks);
    });
  });
});
