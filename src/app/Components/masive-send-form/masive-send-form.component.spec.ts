import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasiveSendFormComponent } from './masive-send-form.component';

describe('MasiveSendFormComponent', () => {
  let component: MasiveSendFormComponent;
  let fixture: ComponentFixture<MasiveSendFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasiveSendFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MasiveSendFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
