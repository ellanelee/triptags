import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

type DeleteManyCapable = {
  deleteMany: (...args: never[]) => Promise<unknown>;
};

function hasDeleteMany(x: unknown): x is DeleteManyCapable {
  return (
    typeof x === 'object' &&
    x !== null &&
    'deleteMany' in x &&
    typeof (x as { deleteMany?: unknown }).deleteMany === 'function'
  );
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    {
      await this.$connect();
      console.log('Data베이스 연결');
    }
  }
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Data베이스 연결해지');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('production실행시 cleanData를 실행불가');
    }

    const modelNames = Reflect.ownKeys(this).filter(
      (key) =>
        typeof key === 'string' &&
        !key.startsWith('_') &&
        key[0] === key[0].toLowerCase(),
    ) as string[];

    return await this.$transaction(async (tx) => {
      for (const modelName of modelNames) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const model = (tx as any)[modelName];
        if (model && 'deleteMany' in model) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          await model.deleteMany();
        }
      }
    });
  }
}
