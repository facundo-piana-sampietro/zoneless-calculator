import { Injectable, signal } from '@angular/core';

const numbers = ['0','1','2','3','4','5','6','7','8','9'];
const operators = ['+', '-', '*', 'x', '/', '÷'];
const specialOperators = ['+/-', '%', '.', '=', 'C', 'Backspace'];

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  public resultText = signal('0')
  public subResultText = signal('0')
  public lastOperator = signal('+')

  public constructNumber(value: string): void {
    if (![...numbers, ...operators, ...specialOperators].includes(value)){
      console.log('Invalid input', value);
      return
    }

    //Calcular resultados
    if (value === '='){
      const result = this.calculateResult();
      this.resultText.set(result.toString());
      this.subResultText.set('0');
      return;
    }

    //Limpiar resultados
    if (value === 'C'){
      this.resultText.set('0');
      this.subResultText.set('0');
      this.lastOperator.set('+');
      return;
    }

    //Backspace
    //TODO: Revisar cuando tengamos números negativos
    if (value === 'Backspace'){
      if (this.resultText() === '0') return;

      if (this.resultText().includes('-') && this.resultText().length === 2){
        this.resultText.set('0');
        return
      }

      if (this.resultText().length === 1){
        this.resultText.set('0');
        return
      }

      this.resultText.update(currentValue => currentValue.slice(0, -1));
      return
    }

    // Aplicar operador
    if (operators.includes(value)){
      
      
      //Si esta buscando resultado a partir de un operador, entra por acá.
      //La validación significa que si toco un operador con ambas variables con algun número,
      //significa que está realizando una operación con eso.
      if (this.resultText() != '0' && this.subResultText() != '0'){
        const result = this.calculateResult();
        this.subResultText.set(result.toString());
        this.resultText.set('0');
        this.lastOperator.set(value);
        return
      } else if (this.resultText() == '0' && this.subResultText() != '0'){
        this.lastOperator.set(value);
        return  
      }
      
      this.lastOperator.set(value);
      this.subResultText.set(this.resultText());
      this.resultText.set('0');
      
      return;
    }

    if (this.resultText().length >= 10){
      console.log('Max lenght reached');
      return;
    }

    //Validar punto decimal
    if (value === '.' && !this.resultText().includes('.')){
      if (this.resultText() === '0' || this.resultText() === ''){
        this.resultText.set('0.');
        return 
      }
      this.resultText.update((text) => text + '.' )
      return
    }

    // Manejo de el 0 inicial
    if (value === '0' && (this.resultText() === '0' || this.resultText() === '-0')) {
      return;
    }

    if (value === '+/-'){
      if (this.resultText().includes('-')){
        this.resultText.update(text => text.slice(1));
        return;
      }

      this.resultText.update(text => `-${text}`)
      return

    }

    //Números
    if(numbers.includes(value)){
      if (this.resultText() === '0'){
        this.resultText.set(value);
        return
      }

      if (this.resultText().includes('-0')){
        this.resultText.set('-' + value);
        return;
      }
      
      this.resultText.update(text => text + value)
    }
  }

  public calculateResult(): string{
    debugger
    const number1 = parseFloat(this.subResultText())
    const number2 = parseFloat(this.resultText())

    let result = 0;

    switch (this.lastOperator()){
      case '+':
        result= number1 + number2;
        break;

      case '-':
        result= number1 - number2;
        break;
      
      case '*':
      case 'x':
        result= number1 * number2;
        break;
      
      case '/':
      case '÷':
        result= number1 / number2;
        break;
    }

    return result.toString();
  }

}
