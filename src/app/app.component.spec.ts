import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

//El describe sirve para agrupar pruebas. Se pueden crear varios describe por archivo, pero se recomienda 1 por archivo.
describe('AppComponent', () => { 

  let fixture: ComponentFixture<AppComponent>
  let compiled: HTMLElement

  //Nos permite ejecutar código antes de cada prueba. Puede ser asíncrona.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent], //Si hay dependencias, se declaran acá.
    }).compileComponents();

    //Fixture: Envoltorio del componente que estamos montando.
    fixture = TestBed.createComponent(AppComponent);

    compiled = fixture.nativeElement as HTMLElement;

  });

  //Esta prueba nos ayuda a saber si nuestra aplicación o componente se pudo montar. Acá podemos saber si hay componentes que arrojan error.
  it('should create the app', () => {
    const app = fixture.componentInstance; //--> Instancia de nuestro componente.
    expect(app).toBeTruthy();
  });

  it("should be 3", () => {
    // A = Arrange
    const num1 = 1
    const num2 = 2;

    // A = Act
    const result = num1 + num2;

    // A = Assert
    expect(result).toBe(3);

  })

  //Se fija que el titulo de la aplicación sea el esperado
  it(`should have the 'zoneless-calculator' title`, () => {
    const app = fixture.componentInstance;
    expect(app.title).toEqual('zoneless-calculator');
  });


  it('should render router-outlet', () => {
    //Se puede negar los assert con un ".not" antes del assert.
    expect(compiled.querySelector('router-outlet')).not.toBeNull()
  });

  it('should render router-outlet wrapped with css classes', () => {
    const divElement = compiled.querySelector('div')

    const mustHaveClasses = 'min-w-screen min-h-screen bg-slate-600 flex items-center justify-center px-5 py-5'.split(' ');

    expect(divElement).not.toBeNull();

    //Esto sirve si sacan clases y no agregan, pero si se agrega una clase, falla.
    // divElement?.classList.forEach(className => {
    //   expect( mustHaveClasses ).toContain(className);
    // })

    const divClasses = divElement?.classList.value.split(' ');

    //Ahora valida que todas las clases que están en mi string estén obligatoriamente en el div.
    //Esto permite agregar clases, pero no sacar las obligatorias.
    mustHaveClasses.forEach(className => {
      expect(divClasses).toContain(className);
    })

  })

  it ("should contain the ' buy me a beer' link", () => {
    const titleMustBe = 'Buy me a beer';
    const hrefMustBe = 'https://www.buymeacoffee.com/scottwindon'
    
    //Evaluamos si existe el anchor. Lo mejor seria obtener el anchor por un id único, ya que si se quiere
    //agregar un anchor en el futuro y no se modifica la prueba, daría error.
    const anchorElement = compiled.querySelector('a')
    expect(anchorElement).not.toBeNull();


    const title = anchorElement?.title;
    const href = anchorElement?.href;
    //const href = anchorElement?.getAttribute('href'); --> También funciona

    //Evaluamos que el titulo y el href sean los indicados.
    expect(title).toBe(titleMustBe)
    expect(href).toBe(hrefMustBe)
  })

});
