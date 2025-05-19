import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export class FormUtils {
  // [TODO] expresiones regulares
  static doblePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static dobleLastName = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
  static urlRegex =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

  static isValiedField(form: FormGroup, fieldName: string): boolean | null {
    return (
      !!form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;
    const errors = form.controls[fieldName].errors ?? {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return `El campo es requerido`;
        case 'minlength':
          return `El campo debe ser al menos ${errors['minlength'].requiredLength} caracteres`;
        case 'min':
          return `El campo debe ser mayor que ${errors['min'].min}`;
        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.doblePattern) {
            return `El campo debe ser un nombre y apellido`;
          }
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return `El campo debe ser un correo válido`;
          }
          if (errors['pattern'].requiredPattern === `${FormUtils.urlRegex}`) {
            return `El campo debe ser un URL válido`;
          }
          return `El campo no cumple con el formato requerido`;
        default:
          return 'Error de validación no controlado';
      }
    }
    return null;
  }

  static noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    };
  }

  /** dataMaxToday()
   * valida que el datapiker seleccionado no sobrepase al día de hoy
   */
  static dataMaxToday(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const value = control.value;
      const dateForm = new Date(value);
      const dateToday = new Date();
      let valid: boolean = dateToday.getTime() >= dateForm.getTime();
      return valid ? null : { dataMaxToday: true };
    };
  }
  static dateMinToday(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      return new Date().setHours(0, 0, 0, 0) <=
        new Date(control.value).setHours(0, 0, 0, 0)
        ? null
        : { dateMinToday: true };
    };
  }

  /**
   * Valida que la startDate (fecha desde) sea menor que la endDate (fecha hasta)
   * Y que la startDate (fecha desde) y endDate (fecha hasta) sea menor que la fecha actual
   * @param formGroup formulario
   * @param startDate fecha inicio
   * @param endDate fecha fin
   * @returns objeto errorDateRange
   */
  static dateRangeCurrentDate(
    formGroup: FormGroup,
    startDate: string,
    endDate: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      let valid: boolean = true;
      if (
        formGroup.controls[startDate].value != null &&
        formGroup.controls[endDate].value != null
      ) {
        const fechaActual = new Date();
        const fechaDesde = new Date(formGroup.controls[startDate].value);
        const fechaHasta = new Date(formGroup.controls[endDate].value);

        const compararFechaActual = new Date(
          fechaActual.getFullYear(),
          fechaActual.getMonth(),
          fechaActual.getDate()
        );
        const compararFechaDesde = new Date(
          fechaDesde.getFullYear(),
          fechaDesde.getMonth(),
          fechaDesde.getDate()
        );
        const compararFechaHasta = new Date(
          fechaHasta.getFullYear(),
          fechaHasta.getMonth(),
          fechaHasta.getDate()
        );

        if (
          compararFechaDesde.getTime() < compararFechaActual.getTime() ||
          compararFechaHasta.getTime() < compararFechaActual.getTime()
        ) {
          return null;
        }
        if (compararFechaDesde.getTime() > compararFechaHasta.getTime()) {
          valid = false;
        } else {
          formGroup.controls[startDate].setErrors(
            this._deleteError(
              formGroup.controls[startDate].errors,
              'errorDateRange'
            )
          );
          formGroup.controls[endDate].setErrors(
            this._deleteError(
              formGroup.controls[endDate].errors,
              'errorDateRange'
            )
          );
        }
      }
      return valid ? null : { errorDateRange: true };
    };
  }

  /**
   * Validation that checks if current file extension is on the expected types set
   *
   * @param types where you define the group of extensions
   * @returns ValidationErrors in case the file extension is not the expected one
   */
  static requiredFileType(types: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (file) {
        const extensionLowerCase = file.split('.').pop().toLowerCase();
        const typesToLowerCase = types.map((type) => type.toLowerCase());
        return !typesToLowerCase.includes(extensionLowerCase)
          ? { requiredFileType: true }
          : null;
      }
      return null;
    };
  }
  /**
   * Valida que la startNumber (número inicial) sea menor que la endNumber (número final)
   * @param formGroup formulario
   * @param startNumber número inicial
   * @param endNumber número final
   * @returns objeto errorCompareNumber
   */
  static compareNumbers(
    formGroup: FormGroup,
    startNumber: any,
    endNumber: any
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      let valid: boolean = true;
      if (
        formGroup.controls[startNumber].value != null &&
        formGroup.controls[endNumber].value != null
      ) {
        valid =
          parseInt(formGroup.controls[startNumber].value) <
          parseInt(formGroup.controls[endNumber].value);
        if (valid) {
          formGroup.controls[startNumber].setErrors(
            this._deleteError(
              formGroup.controls[startNumber].errors,
              'errorCompareNumber'
            )
          );
          formGroup.controls[endNumber].setErrors(
            this._deleteError(
              formGroup.controls[endNumber].errors,
              'errorCompareNumber'
            )
          );
        }
      }
      return valid ? null : { errorCompareNumber: true };
    };
  }

  private static _deleteError(arrayErrors: any = {}, errorKey: string) {
    if (arrayErrors && arrayErrors.hasOwnProperty(errorKey))
      delete arrayErrors[errorKey];
    return arrayErrors && Object.keys(arrayErrors).length > 0
      ? arrayErrors
      : null;
  }
}
