

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorButtonComponent } from './calculator-button.component';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [CalculatorButtonComponent],
  template: `
    <calculator-button>
      <span class="projected-content underline"> Test content </span>
    </calculator-button>
  `
})
class TestHostComponent{}

describe('CalculatorButtonComponent', () => {

  let fixture: ComponentFixture<CalculatorButtonComponent>
  let compiled: HTMLElement
  let component: CalculatorButtonComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorButtonComponent);
    compiled = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance

    //Para que detecte los cambios, como la clase w-2/4 especificada en el host.
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should apply w-1/4 doubleSize is false', () => {
    const hostCssClasses: string[] = compiled.classList.value.split(' ')

    expect(hostCssClasses).toContain('w-1/4');
    expect(component.isDoubleSize()).toBeFalse();
  });

  it('should apply w-2/4 doubleSize is true', () => {
    //De esta manera, creamos un input para el componente, y es necesario detectar cambios después.
    fixture.componentRef.setInput('isDoubleSize', true);
    fixture.detectChanges();

    const hostCssClasses: string[] = compiled.classList.value.split(' ')

    expect(hostCssClasses).toContain('w-2/4');
    expect(component.isDoubleSize()).toBeTrue();
  });

  it('should emit onClick when handleClick is called', () => {
    
    //Espías: Van a estar pendientes de algun suceso. En este caso, lo vamos a usar en el output
    
    //Voy a espiar nuestro output, en especifico el emit
    spyOn( component.onClick, 'emit' )

    component.handleClick();

    expect(component.onClick.emit).toHaveBeenCalled();
  })

  it('should set isPressed to true and then false when keyboardPressStyle is called with a matching key', (done) => {

    //Content value es el viewChild del button, asi que ponemos su texto como 1.
    component.contentValue()!.nativeElement.innerText = '1';
    component.keyboardPressedStyle('1');

    expect(component.isPressed()).toBeTrue();

    //Una milésima de segundo después
    setTimeout(() => {
      expect(component.isPressed()).toBeFalse();
      done(); //--> Esta función sirve para indicarle  karma y jasmine que termino el testing.
              // En este caso, lo utilizamos para que el test espere el timeout. También funciona con async/await.
    }, 101)
  })

  it('should not set isPressed to true if key is not matching', () => {
    component.contentValue()!.nativeElement.innerText = '1';
    component.keyboardPressedStyle('2');

    expect(component.isPressed()).toBeFalse();
  })

  it('should display projected content', () => {
    const testHostFixtures = TestBed.createComponent(TestHostComponent);
    //console.log(testHostFixtures.debugElement); --> Sirve para debuggear que tiene el elemento

    const compiled = testHostFixtures.nativeElement as HTMLDivElement;
    const projectedContent = compiled.querySelector('.projected-content');
    expect(projectedContent).not.toBeNull();
    expect(projectedContent?.classList.contains('underline')).toBeTrue();

  })

});
