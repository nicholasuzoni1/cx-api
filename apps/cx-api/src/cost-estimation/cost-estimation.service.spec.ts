import { Test, TestingModule } from '@nestjs/testing';
import { CostEstimationService } from './cost-estimation.service';

describe('CostEstimationService', () => {
  let service: CostEstimationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CostEstimationService],
    }).compile();

    service = module.get<CostEstimationService>(CostEstimationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
