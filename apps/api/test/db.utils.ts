import { PrismaClient } from '@triptags/database'; 
  
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

    return await this.prisma.$transaction(async (tx) => {
      for (const modelName of modelNames) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const model = tx[modelName];
        if (model && 'deleteMany' in model) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          await model.deleteMany();
        }
      }
    });
  }