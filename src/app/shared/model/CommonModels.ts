export class SelectModel {
  id = 0
  name = ''
}

export interface ListCheckModel {
  id: string,
  name: string
  isChecked: boolean
  disable: boolean
}

export interface listID {
  id: string
}

export interface ISelectModel {
  id: string | number
  name: string;
}