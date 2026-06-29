import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator: el texto NO puede contener dígitos (solo texto).
 *
 * Devuelve `{ hasNumbers: true }` si el valor contiene algún número.
 * Valores vacíos se consideran válidos aquí (delega en `Validators.required`).
 *
 * Aislado en su propio fichero para poder testearlo solo en Fase 2.
 */
export const noNumbersValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value: unknown = control.value;

  if (typeof value !== 'string' || value.length === 0) {
    return null;
  }

  return /\d/.test(value) ? { hasNumbers: true } : null;
};
