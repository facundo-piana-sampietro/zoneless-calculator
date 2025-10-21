import { ChangeDetectionStrategy, Component, computed, HostListener, inject, viewChildren } from '@angular/core';
import { CalculatorButtonComponent } from '../calculator-button.component/calculator-button.component';
import { CalculatorService } from '@/calculator/services/calculator.service';

@Component({
  selector: 'calculator',
  imports: [CalculatorButtonComponent],
  templateUrl: './calculator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keyup)': 'handleKeyboardEvent($event)'
  },

  //Así se puede resolver el encapsulamiento de estilos para el botón de la calculadora.
  // styles: `
  //   .is-command {
  //   @apply bg-indigo-700  bg-opacity-20
  // }
  // `
})
export class CalculatorComponent {

  #calculatorService = inject(CalculatorService);

  // Es una forma de hacerlo, pero se usan sin () en el html. Por eso, para mantener homogeneo, 
  // no lo vamos a hacer así
  // get resultText() {
  //   return this.#calculatorService.resultText;
  // }

  //Cada vez que cambie el valor de los signals manejados dentro, estos signals se van a modificar.
  public resultText = computed( ()=> this.#calculatorService.resultText())
  public subResultText = computed( ()=> this.#calculatorService.subResultText())
  public lastOperator = computed( ()=> this.#calculatorService.lastOperator())

  //Igual que viewChild, pero para más de un hijo. En este caso, tenemos muchos botones hijos. 
  public calculatorButtons = viewChildren(CalculatorButtonComponent);

  handleClick (key: string){
    this.#calculatorService.constructNumber(key)
  }

  //@HostListener('document:keyup', ['$event']) --> Ya no se usa, se utiliza en el atributo "host" 
  // de la anotación @Component
  handleKeyboardEvent(event: KeyboardEvent){
    const key = event.key
    
    const keyEquivalents: Record<string, string> = {
      Escape: 'C',
      Clear: 'C',
      '*': 'x',
      '/': '÷',
      Enter: '=',
    }

    //Si hay una equivalencia, usamos esa. Caso contrario, usamos la tecla que llegó.
    const keyValue = keyEquivalents[key] ?? key;

    this.handleClick(keyValue)

    this.calculatorButtons().forEach(button => {
      button.keyboardPressedStyle(keyValue);
    })
  }
}
