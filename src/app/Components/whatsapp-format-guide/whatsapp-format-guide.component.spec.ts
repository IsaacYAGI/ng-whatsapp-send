import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappFormatGuideComponent } from './whatsapp-format-guide.component';

describe('WhatsappFormatGuideComponent', () => {
  let component: WhatsappFormatGuideComponent;
  let fixture: ComponentFixture<WhatsappFormatGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsappFormatGuideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappFormatGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
