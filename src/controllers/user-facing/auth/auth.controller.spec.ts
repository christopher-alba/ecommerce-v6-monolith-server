import { Test, TestingModule } from '@nestjs/testing';
import { UserFacingAuthController } from './auth.controller';

describe('UserFacingAuthController', () => {
  let controller: UserFacingAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserFacingAuthController],
    }).compile();

    controller = module.get<UserFacingAuthController>(UserFacingAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
