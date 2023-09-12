export const permission = {
  assignRole: 'assignRole',
  deleteUser: 'deleteUser',
  editUser: 'editUser',
  listParking: 'listParking',
  listUser: 'listUser',
  listUserApp: 'listUserApp',
  listCourtesy: 'listCourtesy',
  downloadCourtesy: 'downloadCourtesy',
  deleteRole: 'deleteRole',
  createParking: 'createParking',
  createCourtesy: 'createCourtesy',
  createUser: 'createUser',
  listAntennas: 'listAntennas',
  createAntennas: 'createAntennas',
  deleteAntennas: 'deleteAntennas',
  editAntennas: 'editAntennas',
  downloadQRAntenna: 'downloadQRAntenna',
  listMonthlyParking: 'listMonthlyParking',
  createMonthlyParking: 'createMonthlyParking',
  deleteMonthlyParking: 'deleteMonthlyParking',
  cancelMonthlyParking: 'cancelMonthlyParking',
  disableMonthlyParking: 'disableMonthlyParking',
  createAccessProfileMonthlyParking: 'createAccessProfileMonthlyParking',
  listParkedParking: 'listParkedParking',
  getOutWithPaymentDoneParkedParking: 'getOutWithPaymentDoneParkedParking',
  getOutWithoutPaymentDoneParkedParking:
    'getOutWithoutPaymentDoneParkedParking',
  changeParkingAtCreateUser: 'changeParkingAtCreateUser',
  listCourtesyStationary: 'listCourtesyStationary',
  createCourtesyStationary: 'createCourtesyStationary',
  editCourtesyStationary: 'editCourtesyStationary',
  addParkingToCourtesyStationary: 'addParkingToCourtesyStationary',
  addStationsCourtesyStationary: 'addStationsCourtesyStationary',
  editStationsCourtesyStationary: 'editStationsCourtesyStationary',
  deleteStationsCourtesyStationary: 'deleteStationsCourtesyStationary',
  graficosIngresoVehiculos: 'graficosIngresoVehiculos',
  graficosFlujoDinero: 'graficosFlujoDinero',
  graficosCortesias: 'graficosCortesias',
  verMenuPayment: 'verMenuPayment',
  verDiscuontReport: 'verDiscuontReport',
  verDurationReport: 'verDurationReport',
  verDailyParkingReport: 'verDailyParkingReport',
  verMonthlyParkingReport: 'verMonthlyParkingReport',
  verDailyParkingReportTicket: 'verDailyParkingReportTicket',
  verCourtesiesReport: 'verCourtesiesReport',
  verTodosLosParqueosDashboard: 'verTodosLosParqueosDashboard',
  verTodosLosParqueosReport: 'verTodosLosParqueosReport',
  verCourtesiesStationReport: 'verCourtesiesStationReport',
  verBillingReport: 'verBillingReport',
  verHistoryOfCourtesyReport: 'verHistoryOfCourtesy',
  verBitacora: 'verBitacora',
  graficosCortesiasEstacionarias: 'graficosCortesiasEstacionarias',
  listLocal: 'listLocal',
  createLocal: 'createLocal',
  disableLocal: 'disableLocal',
  editLocal: 'editLocal',
  listSchedules: 'listSchedules',
  listTariff: 'listTariff',
  createTariff: 'createTariff',
  tariffTest: 'tariffTest',
  newTicket: 'newTicket',
  listInvoiceInfo: 'changeInvoiceInfo',
  restartPassword: 'restartPassword',
  updateFiles: 'updateFiles',
  transitDetailReport: 'transitDetailReport',
  blacklistReport: 'blacklistReport',
  assignCourtesyPermission: 'assignCourtesyPermission',
  changePermissions: 'changePermissions',
  listEditParking: 'listEditParking',
  disableCourtesies: 'disableGroupOfCourtesies',
  viewBiltmoreReport: 'hasPermissionToViewBiltmoreReport'
}
export const leftMenu = [
  {
    path: '/home',
    module: 'home',
    description: '',
    isShow: false
  },
  {
    path: '/home/dashboard',
    module: 'dashboard',
    description: 'Dashboard',
    icon: 'fa-tachometer-alt',
    isShow: true
  },
  {
    path: '/home/management',
    module: 'management',
    description: 'Administración',
    icon: 'fa-chart-line',
    isShow: true
  },
  {
    path: '/home/courtesy',
    module: 'courtesy',
    description: 'Cortesías',
    icon: 'fa-calendar-check',
    isShow: true
  },
  {
    path: '/home/parking',
    module: 'parking',
    description: 'Parqueos',
    icon: 'fa-parking',
    isShow: true
  },
  {
    path: '/home/report',
    module: 'report',
    description: 'Reportes',
    icon: 'fa-chart-pie',
    isShow: true
  },
  {
    path: '/home/support',
    module: 'support',
    description: 'Soporte',
    icon: 'fa-info-circle',
    isShow: true
  }
]
export const DiscountOnWhat = [
  {id: 1, name: 'Total'},
  {id: 2, name: 'Cantidad de horas'}
]
export const TypeOfCondition = [
  {id: 1, name: 'Aplicar siempre'},
  {id: 2, name: 'Solo si Cant. Horas es menor o igual a '},
  {id: 3, name: 'Sumar tarifa normal y aplicar descuento solo a'},
  {id: 4, name: 'Horas gratis y restar cantidad despues de'},
]
export const settings = {
  siteKey: '6LesloIfAAAAANKGMOJ5SOxyRugy3woH7Y1DP1f6',
  passwordPattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{7,}$'
}
