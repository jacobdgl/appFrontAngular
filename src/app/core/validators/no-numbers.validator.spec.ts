import { FormControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { noNumbersValidator } from './no-numbers.validator';

describe('noNumbersValidator', () => {
  it('devuelve null para texto sin dígitos', () => {
    const control = new FormControl('tarea limpia');
    expect(noNumbersValidator(control)).toBeNull();
  });

  it('devuelve { hasNumbers: true } para texto con un dígito', () => {
    const control = new FormControl('tarea 3');
    expect(noNumbersValidator(control)).toEqual({ hasNumbers: true });
  });

  it('devuelve { hasNumbers: true } cuando el valor es solo dígitos', () => {
    const control = new FormControl('123');
    expect(noNumbersValidator(control)).toEqual({ hasNumbers: true });
  });

  it('considera válido el string vacío (delega en Validators.required)', () => {
    const control = new FormControl('');
    expect(noNumbersValidator(control)).toBeNull();
  });

  it('considera válido un string de solo espacios (no contiene dígitos)', () => {
    const control = new FormControl('   ');
    expect(noNumbersValidator(control)).toBeNull();
  });

  it('considera válido texto con símbolos pero sin números', () => {
    const control = new FormControl('¡tarea! @#%&');
    expect(noNumbersValidator(control)).toBeNull();
  });

  it('considera válido un valor null (no es string)', () => {
    const control = new FormControl(null);
    expect(noNumbersValidator(control)).toBeNull();
  });

  it('detecta un dígito en cualquier posición del texto', () => {
    const control = new FormControl('comprar 2 manzanas hoy');
    expect(noNumbersValidator(control)).toEqual({ hasNumbers: true });
  });
});
