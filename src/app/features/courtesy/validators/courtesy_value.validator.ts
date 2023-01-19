import {FormGroup} from "@angular/forms";


export const courtesyValue = (frm: FormGroup) => {
  const value = frm.get('value')?.value;
  const type = frm.get('type')?.value;

  switch (type) {
    case 1:
      if (value > 100) {
        frm.get('value')?.setErrors({value: true});
        return {'match': `Value ${value} is greater than 100`};
      }
      break;
    case 4:
      if (value > 24) {
        frm.get('value')?.setErrors({value: true});
        return {'match': `Value ${value} is greater than 24`};
      }
      break;
  }
  return null;

}
