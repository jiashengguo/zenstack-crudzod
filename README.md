# ZenStack CRUD Zod Plugin

ZenStack CRUD Zod Plugin is a standard plugin for [ZenStack](https://zenstack.dev) that generate Zod schemas for all CRUD operations (Prisma Client API) for each model in your ZModel schema.

This is particularly useful for building AI agent, where you want LLM to be able to operate on your database safely per user's request using Prisma Client API like `findMany`, `create`, and `update`.

## Example

For models like:

```typescript
model User {
    id       String  @id @default(cuid())
    name     String
    todo     Todo[]
    list     List[]
}

model Todo {
    id        String   @id @default(uuid())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    owner     User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
    ownerId   String
    title     String
    completed Boolean  @default(false)
}

model List {
    id        String   @id @default(uuid())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    owner     User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
    ownerId   String
    title     String
    private   Boolean  @default(false)
    todos     Todo[]
}
```

The plugin now generate 3 Zod schemas for each model. For example, for the `User` model, it generates:

```typescript
export const UserFindManyArgsSchema = z
    .object({
        where: UserWhereInput.optional(),
        include: UserInclude.optional(),
    })
    .describe('Prisma client API `findMany` function args for User model');

export const UserCreateArgsSchema = z
    .object({
        data: UserCreateInput,
    })
    .describe('Prisma client API `create` function args for User model');

export const UserUpdateArgsSchema = z
    .object({
        data: UserUpdateInputSchema,
        where: UserWhereInput,
    })
    .describe('Prisma client API `update` function args for User model');
```

It also generate a complete `allSchemas` object that contains all the generated schemas for all models:

```typescript
export const allSchemas = {
    list: {
        findMany: ListFindManyArgsSchema,
        update: ListUpdateArgsSchema,
        create: ListCreateArgsSchema,
    },
    todo: {
        findMany: TodoFindManyArgsSchema,
        update: TodoUpdateArgsSchema,
        create: TodoCreateArgsSchema,
    },
    user: {
        findMany: UserFindManyArgsSchema,
        update: UserUpdateArgsSchema,
        create: UserCreateArgsSchema,
    },
};
```

## Setup

1. Install the package:

```bash
npm install -D zenstack-crudzod
```

2. Add the plugin to your ZModel schema file:

```typescript
plugin zenstack_crud_zod {
    provider = 'zenstack-crudzod'
    // optional: specify output path
    output = '.'
}
```

3. Generate the Zod schemas:

```bash
npx zenstack generate
```

After running the command, you'll see a `crud-zod.ts` file generated in the specified output directory (or the current directory if not specified).

## Options

| Name   | Type   | Description                                            | Required | Default           |
| ------ | ------ | ------------------------------------------------------ | -------- | ----------------- |
| output | String | Output directory path (relative to the path of ZModel) | No       | current directory |

## Local Development

### Install

```bash
npm install
```

### Build

```bash
npm run build
```

After building, the plugin will be generated in the `dist` folder. Then you can use it in your existing ZModel schema by setting the `provider` to this `dist` folder:

```typescript
plugin zenstack_crud_zod {
    provider = '../path/to/zenstack-crudzod/dist'
}
```

## License

MIT
