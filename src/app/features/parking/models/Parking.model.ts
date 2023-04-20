export class ParkingModel {
  id = ''
  name = ''
  haveStation? = 0
}

export class ParkedModel {
  id = ''
  status = 0
  type = 0
  entry_date: Date = new Date()
  exit_date: Date = new Date()
  user_name = ''
  last_name = ''
  phone_number = ''
  parking = ''
  parkingId = ''
}

class UserParked {
  name = ''
  last_name = ''
  phone_number = ''
}

class ParkingParked {
  id = ''
  name = ''
}

export const StatusParked = [
  {
    id: 1,
    name: 'Dentro del parqueo'
  },
  {
    id: 4,
    name: 'Problema con la estación'
  }, {
    id: 2,
    name: 'Problemas con el pago'
  }
]
/*
 * Add an object with
 *  id: 2 for 'Fuera del parqueo'
 * And
 *  id: '' with name 'Todos'
 * To have all entrances and exits.
 */
