import {Injectable} from '@angular/core'
import {AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup} from '@angular/forms'

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  get getPatterEmail() {
    return "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
  }

  markAsTouched(form: UntypedFormGroup) {
    Object.values(form.controls).forEach((control: AbstractControl) =>
      control.markAsTouched()
    )
  }

  markAsInvalid(form: UntypedFormGroup, control: string, error: any) {
    form.get(control)?.setErrors(error)
  }

  randomString(): string {
    const allCapsAlpha = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z'
    ]
    const allLowerAlpha = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z'
    ]
    const allNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    const symbols = ['$', '#', '!', '^', '&', '*']
    const len = 11

    const base = [...allCapsAlpha, ...allNumbers, ...allLowerAlpha, ...symbols]
    let newPassword = [...Array(len)]
      .map((i) => base[(Math.random() * base.length) | 0])
    if (newPassword.filter((item) => allCapsAlpha.includes(item)).length == 0) {
      console.log('no hay mayusculas: ', newPassword.join())
      newPassword.push(allCapsAlpha[(Math.random() * allCapsAlpha.length) | 0])
    }
    if (newPassword.filter((item) => allLowerAlpha.includes(item)).length == 0) {
      newPassword.push(allLowerAlpha[(Math.random() * allLowerAlpha.length) | 0])
      console.log('no hay minusculas: ', newPassword.join())
    }
    if (newPassword.filter((item) => allNumbers.includes(item)).length == 0) {
      newPassword.push(allNumbers[(Math.random() * allNumbers.length) | 0])
      console.log('no hay numeros: ', newPassword.join())
    }
    if (newPassword.filter((item) => symbols.includes(item)).length == 0) {
      newPassword.push(symbols[(Math.random() * symbols.length) | 0])
      console.log('no hay simbolos: ', newPassword.join())
    }
    console.log(newPassword.join(''))
    return newPassword.join('');
  }

  markAsUnTouched(form: UntypedFormGroup) {
    Object.values(form.controls).forEach((control: AbstractControl) =>
      control.markAsUntouched()
    )
  }

  controlInvalid(form: UntypedFormGroup, control: string): boolean {
    const resp: boolean | undefined =
      form.get(control)?.invalid && form.get(control)?.touched
    return resp == undefined ? false : resp
  }

  controlInvalidArray(arrayForm: UntypedFormArray) {
    Object.values(arrayForm.controls).forEach((group) => {
      Object.values((group as UntypedFormArray).controls).forEach((control) => {
        control.markAsTouched()
      })
    })
  }

  validateNIT(control: UntypedFormControl): { [s: string]: boolean } | null {
    if (control.value == null) {
      return null
    }
    const nitArray: number[] = Array.from(String(control.value), Number)
    const checker: number = nitArray[nitArray.length - 1]
    let total = 0
    for (let i = 0; i < nitArray.length - 1; i++) {
      total = total + nitArray[i] * (i + 2)
    }
    if (Math.round(Math.round(total % 11) % 11) != checker) {
      return {
        nitRight: true
      }
    }
    return null
  }

  disableForm(form: UntypedFormGroup) {
    for (const controlsKey in form.controls) {
      form.controls[controlsKey].disable()
    }
  }

  enableForm(form: UntypedFormGroup) {
    for (const controlsKey in form.controls) {
      form.controls[controlsKey].enable()
    }
  }
}

export const getCurrentDataTablePage = (dataTablesParameters: any) => {
  return dataTablesParameters.start == 0 ? 1 : (dataTablesParameters.start / dataTablesParameters.length) + 1;
}
