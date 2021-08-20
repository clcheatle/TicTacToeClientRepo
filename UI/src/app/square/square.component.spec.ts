import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareComponent } from './square.component';

describe('SquareComponent', () => {
  let component: SquareComponent;
  let fixture: ComponentFixture<SquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should display a X if that is the symbol sent', () => {
    component.symbol = 'X';
    fixture.detectChanges();
    component.ngOnInit();
    let button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toMatch('X');
  });

  it('it should display a O if that is the symbol sent', () => {
    component.symbol = 'O';
    fixture.detectChanges();
    component.ngOnInit();
    let button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toMatch('O');
  });

  it('it should display nothing if that is the symbol sent is not a X or O', () => {
    component.symbol = '1';
    fixture.detectChanges();
    component.ngOnInit();
    let button = fixture.nativeElement.querySelector('button');
    expect(button).toBeNull();
    expect(component.symbol).toBe('');
  });
});
