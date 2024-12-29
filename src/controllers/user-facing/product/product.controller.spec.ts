import { Test, TestingModule } from '@nestjs/testing';
import { UserFacingProductController } from './product.controller';

describe('UserFacingProductController', () => {
  let controller: UserFacingProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserFacingProductController],
    }).compile();

    controller = module.get<UserFacingProductController>(UserFacingProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
