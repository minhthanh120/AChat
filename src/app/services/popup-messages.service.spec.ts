import { TestBed } from '@angular/core/testing';

import { PopupMessagesService } from './popup-messages.service';

describe('PopupMessagesService', () => {
  let service: PopupMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopupMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
