import { Test, TestingModule } from '@nestjs/testing';
import { AdminFacingAuthController } from './auth.controller';

describe('AdminFacingAuthController', () => {
  let controller: AdminFacingAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminFacingAuthController],
    }).compile();

    controller = module.get<AdminFacingAuthController>(AdminFacingAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
