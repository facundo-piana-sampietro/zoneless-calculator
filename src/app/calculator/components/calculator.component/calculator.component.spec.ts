

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorComponent } from './calculator.component';
import { CalculatorService } from '@/calculator/services/calculator.service';
import { By } from '@angular/platform-browser';
import { CalculatorButtonComponent } from '../calculator-button.component/calculator-button.component';

class MockCalculatorService {
    public resultText = jasmine.createSpy('resultText').and.returnValue('100.00');
    public subResultText = jasmine.createSpy('subResultText').and.returnValue('20');
    public lastOperator = jasmine.createSpy('lastOperator').and.returnValue('-');

    public constructNumber = jasmine.createSpy('constructNumber');
}

describe('CalculatorComponent', () => {

    let fixture: ComponentFixture<CalculatorComponent>
    let compiled: HTMLElement
    let component: CalculatorComponent
    //Instancia del mock para hacer pruebas con calculator service
    let mockCalculatorService: MockCalculatorService

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CalculatorComponent],
            /*
            Vamos a reemplazar el uso de CalculatorService por MockCalculatorService.
            Se utiliza este mock ya que, cuando querramos probar el calculatorComponent,
            inevitablemente vamos a usar los metodos de calculator service, y este testing
            no debe depender de la funcionalidad de otros ya que, si falla calculatorService,
            este componente también. Las pruebas deben ser atómicas.
            */
            providers: [
                {
                    provide: CalculatorService, useClass: MockCalculatorService
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CalculatorComponent);
        compiled = fixture.nativeElement as HTMLElement;
        component = fixture.componentInstance
        //Acá inyectamos el mock con la clase de calculatorService, pero pasandolo por TestBed primero.
        mockCalculatorService = TestBed.inject(CalculatorService) as unknown as MockCalculatorService;
        //fixture.detectChanges(); --> Comentamos esta linea ya que, para el detecte changes de mas abajo sería tarde.
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should have the current getters', () => {
        expect(component.resultText()).toBe('100.00')
        expect(component.subResultText()).toBe('20')
        expect(component.lastOperator()).toBe('-')
    })

    it('should display proper calculation values', () => {

        mockCalculatorService.resultText.and.returnValue('123');
        mockCalculatorService.subResultText.and.returnValue('456');
        mockCalculatorService.lastOperator.and.returnValue('*');
        fixture.detectChanges();

        expect(compiled.querySelector('span')?.innerText).toBe('456 *')

        expect(component.resultText()).toBe('123')
        expect(component.subResultText()).toBe('456')
        expect(component.lastOperator()).toBe('*')
    })

    it('should have 19 calculator-button components', () => {
        expect(component.calculatorButtons).toBeTruthy();
        expect(component.calculatorButtons().length).toBe(19);
    })

    it('should have 19 calculator-button with content projection', () => {

        //Primera forma: Mediante By
        const buttonByDirective = fixture.debugElement.queryAll(
            By.directive(CalculatorButtonComponent)
        )

        expect(buttonByDirective.length).toBe(19);

        //-------------------------------------------

        //Segunda forma: Mediante querySelectorAll

        //querySelectorAll para tomar todos
        const buttons = compiled.querySelectorAll('calculator-button');
        expect(buttons.length).toBe(19);

        expect(buttons[0].textContent?.trim()).toBe('C');
        expect(buttons[1].textContent?.trim()).toBe('+/-');
        expect(buttons[2].textContent?.trim()).toBe('%');
        expect(buttons[3].textContent?.trim()).toBe('÷');
    })


    it('should handle keyboard events correctly', () => {
        //Obligamos a lanzar el evento de Enter
        const eventEnter = new KeyboardEvent('keyup', {key: 'Enter'});
        document.dispatchEvent(eventEnter);
    
        //Si yo presione Enter, debe aparecer un =
        expect(mockCalculatorService.constructNumber).toHaveBeenCalledWith('=');
        
        const eventESC = new KeyboardEvent('keyup', {key: 'Escape'});
        document.dispatchEvent(eventESC);
    
        expect(mockCalculatorService.constructNumber).toHaveBeenCalledWith('C');

         const event1 = new KeyboardEvent('keyup', {key: '1'});
        document.dispatchEvent(event1);
    
        expect(mockCalculatorService.constructNumber).toHaveBeenCalledWith('1');
    })

    it ('should display result text correctly', ()=> {
        mockCalculatorService.resultText.and.returnValue('123');
        mockCalculatorService.subResultText.and.returnValue('10');
        mockCalculatorService.lastOperator.and.returnValue('+');
        fixture.detectChanges();

        expect(component.resultText()).toBe('123');

        expect(compiled.querySelector('#sub-result')?.textContent).toContain('10 +');


    })

});
