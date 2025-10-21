import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, input, output, signal, viewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'calculator-button',
  imports: [],
  templateUrl: './calculator-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./calculator-button.component.css'],
  host: {
    class: 'border-r border-b border-emerald-400',
    '[class.w-2/4]': 'isDoubleSize()',
    '[class.w-1/4]': '!isDoubleSize()'
  },
  //encapsulation: ViewEncapsulation.None
})
export class CalculatorButtonComponent { 

public isPressed = signal(false);

  public onClick = output<string>();
  public contentValue = viewChild<ElementRef<HTMLButtonElement>>('button');

  public isCommand = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value
  });

  public isDoubleSize = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value
  });

  /*
    Setea el estilo "w-2/4 al host (es decir, sobre la etiqueta de calculator-button) cuando
    el input "isDoubleSize" devuelva "true".
    No es lo recomendado, por eso se migra al atributo "host" del @Component
  */
  // @HostBinding('class.w-2/4') get commandStyle(){
  //   return this.isDoubleSize();
  // }

  handleClick (){
    if (!this.contentValue()?.nativeElement){
      return;
    }

    const value = this.contentValue()!.nativeElement.innerText;
    this.onClick.emit(value.trim());
  }

  public keyboardPressedStyle(key: string){
    if (!this.contentValue()) return;
    
    const value = this.contentValue()!.nativeElement.innerText;

    if (value !== key) return

    this.isPressed.set(true);
      
    setTimeout(() => {
      this.isPressed.set(false);
    },100)

  }


}
