import { Test, TestingModule } from '@nestjs/testing';
import { SecondAuthController } from './second-auth.controller';

describe('SecondAuthController', () => {
  let controller: SecondAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecondAuthController],
    }).compile();

    controller = module.get<SecondAuthController>(SecondAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
