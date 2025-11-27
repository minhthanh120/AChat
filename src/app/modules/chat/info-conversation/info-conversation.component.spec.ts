import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoConversationComponent } from './info-conversation.component';

describe('InfoConversationComponent', () => {
  let component: InfoConversationComponent;
  let fixture: ComponentFixture<InfoConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoConversationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
