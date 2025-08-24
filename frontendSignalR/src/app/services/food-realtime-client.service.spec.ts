import { TestBed } from '@angular/core/testing';

import { FoodRealtimeClientService } from './food-realtime-client.service';

describe('FoodRealtimeClientService', () => {
  let service: FoodRealtimeClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodRealtimeClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
