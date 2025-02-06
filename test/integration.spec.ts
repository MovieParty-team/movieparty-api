import dataSource, { prepareTestSchema } from '@/config/orm.config';
import { DynamicModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Integration tests', () => {
  beforeAll(async () => {
    await dataSource.initialize();
    await prepareTestSchema(dataSource);

    const typeOrmTestingConfig = (): DynamicModule =>
      TypeOrmModule.forRoot(dataSource.options);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [],
      imports: [typeOrmTestingConfig()],
    }).compile();

    await app.init();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(dataSource).toBeDefined();
  });

  it('should be defined', () => {
    expect(prepareTestSchema).toBeDefined();
  });

  it('database should be initialized', async () => {
    expect(dataSource.isInitialized).toBeTruthy();
  });
});
