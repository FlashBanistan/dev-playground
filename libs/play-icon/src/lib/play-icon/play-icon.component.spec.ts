import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayIconComponent } from './play-icon.component';

describe('PlayIconComponent', () => {
  let component: PlayIconComponent;
  let fixture: ComponentFixture<PlayIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayIconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
