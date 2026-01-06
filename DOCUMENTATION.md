# Overview
This task was implemented using NestJS, GraphQL (Code-First Approach), and TypeORM. 

## Approach & Architecture

### Code-First GraphQL
Data models are defined using TypeScript classes and decorators, from which the GraphQL schema is automatically generated.
Entities and DTOs are decorated with `@ObjectType()`, `@InputType()`, and `@Field()`.

### Database Layer (TypeORM)
TypeORM is used for database interactions.
- **Task**: Represents the `task` table.
- sqlite in memory database was used for simplicity.

### Validation & Sanitization
Data integrity and security are enforced using `class-validator` and `class-transformer`.
- **Global Pipes**: The application is configured with `ValidationPipe({ transform: true })`, enabling automatic transformation and validation of incoming payloads.
- **DTOs**: `CreateTaskInput` enforces rules like `@IsString`, `@IsNotEmpty`, and uses `@Transform` to trim whitespace from inputs.

## Component Details

### 1. Task Module (`TaskModule`)
Encapsulates `TaskService`, `TaskResolver`, and registers `Task` with TypeORM.

### 2. Task Entity (`Task`)
Defines the data structure:
- `id`: UUID (Auto-generated)
- `title`: String (Max 200 chars)
- `description`: Text (Optional)
- `status`: Enum (`TODO`, `IN_PROGRESS`, `DONE`)
- `priority`: Enum (`LOW`, `MEDIUM`, `HIGH`)
- `storeId`: UUID
- `timestamps`: `createdAt`, `updatedAt`

### 3. Task Service (`TaskService`)
- `createTask`: Handles task creation. Assumptions: The `storeId` wiil be passed from the frontend, and the `createdById` will be retrieved within the service (Current implementation uses a random string that will always be unique).
- `updateTask`: Updates task status.
- `getTasks`: Retrieves tasks with filtering (by `storeId`, `status`) and sorting (by `createdAt` DESC).

### 4. Task Resolver (`TaskResolver`)
Exposes the functionality via GraphQL API:
- **Queries**: `getTasks`
- **Mutations**: `createTask`, `updateTask`

## Key Decisions
- **Enums**: `TaskStatus` and `TaskPriority` are explicitly registered in GraphQL to ensure strict typing across the API.
- **Separation of Concerns**: DTOs are separated from Entities to strictly control input data and avoid over-posting.
- **Sorting**: Enforced default sorting by `createdAt` DESC to show the newest tasks first.

### Testing
- Run `npm run start:dev` to run the app in watch mode, then navigate to `http://localhost:3000/graphql`
- Run `npm run test` to run the tests.

## Sample Requests and Response
### Create Task 
Req
```graphql
mutation {
  createTask(createTaskInput: {
    title: "Work on Assesment", 
    description: "Build backend app using GraphQL",
    priority:MEDIUM,
    storeId: "uljskdhfjksdhkh23"
  }) {
    id
    title
    description
    priority
    status
    storeId
    createdById
    createdAt
    updatedAt
  }
}
```
Res
```graphql
{
  "data": {
    "createTask": {
      "id": "30b1eaa8-6cb5-442d-842d-1251eff9fb78",
      "title": "Work on Assesment",
      "description": "Build backend app using GraphQL",
      "priority": "MEDIUM",
      "status": "TODO",
      "storeId": "uljskdhfjksdhkh23",
      "createdById": "random_merchant_id:1767704605248",
      "createdAt": "2026-01-06T13:03:25.000Z",
      "updatedAt": "2026-01-06T13:03:25.000Z"
    }
  }
}
```

### Update Task
Req
```graphql
mutation {
  updateTask(id: "30b1eaa8-6cb5-442d-842d-1251eff9fb78", status: DONE){
    id
    title
    status
  }
}
```
Res
```
{
  "data": {
    "updateTask": {
      "id": "30b1eaa8-6cb5-442d-842d-1251eff9fb78",
      "title": "Work on Assesment",
      "status": "DONE"
    }
  }
}
```
### Get tasks
Query
```
{
  getTasks(storeId:"uljskdhfjksdhkh23", status:DONE) {
    title
    status
  }
}
```
Res
```
{
  "data": {
    "getTasks": [
      {
        "title": "Work on Assesment",
        "status": "DONE"
      }
    ]
  }
}
```