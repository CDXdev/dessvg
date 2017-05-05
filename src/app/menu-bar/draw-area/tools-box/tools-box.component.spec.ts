import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsBoxComponent } from './tools-box.component';

describe('ToolsBoxComponent', () => {
  let component: ToolsBoxComponent;
  let fixture: ComponentFixture<ToolsBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolsBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
