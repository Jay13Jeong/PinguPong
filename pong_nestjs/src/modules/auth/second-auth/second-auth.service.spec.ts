import { Test, TestingModule } from '@nestjs/testing';
import { SecondAuthService } from './second-auth.service';

describe('SecondAuthService', () => {
  let service: SecondAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecondAuthService],
    }).compile();

    service = module.get<SecondAuthService>(SecondAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
