import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotpageComponent } from './chatbotpage.component';

describe('ChatbotpageComponent', () => {
  let component: ChatbotpageComponent;
  let fixture: ComponentFixture<ChatbotpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatbotpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
