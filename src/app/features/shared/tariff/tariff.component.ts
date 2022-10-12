import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms'
import {UtilitiesService} from '../../../shared/services/utilities.service'
import {MessageService} from '../../../shared/services/message.service'
import {HolidayInputModel} from './model/HolidayTariff.model'
import {RankInputModel} from './model/RankTariff.model'
import {BlockInputModel} from './model/BlockTariff.model'
import {DefaultInputModel} from './model/DefaultTariff.model'
import {ParkingService} from '../../parking/services/parking.service'
import {CurrencyPipe, DatePipe, Time} from '@angular/common'
import {ValidationsService} from './service/validations.service'
import {AuthService} from '../../../shared/services/auth.service'
import {TariffFormsService} from './service/tariff-forms.service'
import {All, FixedCostInputModel, HourHalfInputModel, IEvent, Rules} from './model/Tariff.model'
import {CreateTariffModel} from '../../parking/models/Tariff.model'
import {BuildRulesService} from './service/build-rules.service'
import {environment} from '../../../../environments/environment'
import {PermissionsService} from '../../../shared/services/permissions.service'
import {DailyInputModel} from './model/DailyTariff.model'

@Component({
  selector: 'app-tariff',
  templateUrl: './tariff.component.html',
  styleUrls: ['./tariff.component.css']
})
export class TariffComponent implements OnInit {
  @Input() parkingId!: string
  @Input() isCreatingParking!: boolean
  @Output() changeStep = new EventEmitter<number>()
  timeRange = 1
  costType = 1
  tariffs: Array<any> = []
  createTariff = environment.createTariff
  generalDataForm: UntypedFormGroup = this.tariffForms.createGeneralDataForm()
  holidayForm: UntypedFormGroup = this.tariffForms.createHolidayOrRankForm()
  rankForm: UntypedFormGroup = this.tariffForms.createHolidayOrRankForm()
  blockForm: UntypedFormGroup = this.tariffForms.createBlockForm()
  defaultForm: UntypedFormGroup = this.tariffForms.createDefaultForm()
  dailyForm: UntypedFormGroup = this.tariffForms.createDailyForm()
  prioriceForm: UntypedFormGroup = this.tariffForms.createPrioriceForm()
  daysSelectedForm: UntypedFormGroup = this.tariffForms.createDaysSelectedForm()
  principalScheduleForm: UntypedFormGroup =
    this.tariffForms.createPrincipalScheduleForm()

  hourAHalfForm: UntypedFormGroup = this.tariffForms.createHourHalfForm()
  fixedCostForm: UntypedFormGroup = this.tariffForms.createFixedCostForm()

  constructor(
    private formBuilder: UntypedFormBuilder,
    private utilitiesService: UtilitiesService,
    private messageService: MessageService,
    private parkingService: ParkingService,
    private date: DatePipe,
    private currencyPipe: CurrencyPipe,
    private authService: AuthService,
    private validationService: ValidationsService,
    private tariffForms: TariffFormsService,
    private buildRuleService: BuildRulesService,
    private permissionService: PermissionsService
  ) {}

  get daysFormValues() {
    const days: number[] = []
    const { mon, tue, wen, thu, fri, sat, sun } = this.justDaysValue

    mon == true ? days.push(1) : false
    tue == true ? days.push(2) : false
    wen == true ? days.push(3) : false
    thu == true ? days.push(4) : false
    fri == true ? days.push(5) : false
    sat == true ? days.push(6) : false
    sun == true ? days.push(0) : false
    return days
  }

  get justDaysValue() {
    const mon = this.daysSelectedForm.get('mon')?.value
    const tue = this.daysSelectedForm.get('tue')?.value
    const wen = this.daysSelectedForm.get('wed')?.value
    const thu = this.daysSelectedForm.get('thu')?.value
    const fri = this.daysSelectedForm.get('fri')?.value
    const sat = this.daysSelectedForm.get('sat')?.value
    const sun = this.daysSelectedForm.get('sun')?.value
    return {
      mon,
      tue,
      wen,
      thu,
      fri,
      sat,
      sun
    }
  }

  get isSudo() {
    return this.authService.isSudo
  }

  get generalDataFormValues() {
    return {
      name: this.generalDataForm.get('name')?.value,
      description: this.generalDataForm.get('description')?.value,
      isShowDescription: this.generalDataForm.get('isShowDescription')?.value,
      hasGlobalSchedule: this.generalDataForm.get('hasGlobalSchedule')?.value,
      isPerDayCondition: this.generalDataForm.get('isPerDayCondition')?.value,
      parkingId: this.generalDataForm.get('parkingId')?.value
    }
  }

  get daysValuesDescription() {
    const days: string[] = []
    const { mon, tue, wen, thu, fri, sat, sun } = this.justDaysValue

    mon == true ? days.push('Lunes') : false
    tue == true ? days.push('Martes') : false
    wen == true ? days.push('Miércoles') : false
    thu == true ? days.push('Jueves') : false
    fri == true ? days.push('Viernes') : false
    sat == true ? days.push('Sábado') : false
    sun == true ? days.push('Domingo') : false

    return days
  }

  get hasGlobalSchedule() {
    return this.generalDataForm.get('hasGlobalSchedule')?.value
  }

  get prioriceTime(): number {
    return this.prioriceForm.get('prioriceCost')?.value
  }

  get prioriceDescription(): string {
    return this.prioriceTime == 1
      ? 'Tomar en cuenta solo tarifa de entrada.'
      : 'Tomar en cuenta solo tarifa de salida.'
  }

  get holidayFormValues(): HolidayInputModel {
    const fromDate = this.date.transform(
      this.holidayForm.get('from')?.value,
      'short'
    )
    const toDate = this.date.transform(
      this.holidayForm.get('to')?.value,
      'short'
    )
    return {
      static_descriptionTime: `Día festivo: Desde ${fromDate} Hasta el ${toDate}.`,
      fromDate: new Date(this.holidayForm.get('from')?.value),
      toDate: new Date(this.holidayForm.get('to')?.value)
    }
  }

  get rankFormValues(): RankInputModel {
    const fromTime: Time = {
      hours: this.getHour(this.rankForm.get('from')?.value),
      minutes: this.getMinutes(this.rankForm.get('from')?.value)
    }
    const toTime: Time = {
      hours: this.getHour(this.rankForm.get('to')?.value),
      minutes: this.getMinutes(this.rankForm.get('to')?.value)
    }
    return {
      static_descriptionTime: `Por Horarios o rangos:Desde: ${this.toConvert24(
        this.rankForm.get('from')?.value
      )} Hasta: ${this.toConvert24(this.rankForm.get('to')?.value)}.`,
      fromTime,
      toTime
    }
  }

  get blockFormValues(): BlockInputModel {
    const hourLowerLimit = this.blockForm.get('hourLowerLimit')?.value
    const hourUpperLimit = this.blockForm.get('hourUpperLimit')?.value
    const minuteLowerLimit = this.blockForm.get('minuteLowerLimit')?.value
    const minuteUpperLimit = this.blockForm.get('minuteUpperLimit')?.value

    return {
      static_descriptionTime: `Por bloques: De ${hourLowerLimit} con ${minuteLowerLimit} minutos, a ${hourUpperLimit} horas con ${minuteUpperLimit} minutos.`,
      hourLowerLimit,
      minuteLowerLimit,
      minuteUpperLimit,
      hourUpperLimit
    }
  }

  get hourHalfFormValues(): HourHalfInputModel {
    const costHour = this.hourAHalfForm.get('hourCost')?.value
    const costAHalf = this.hourAHalfForm.get('halfCost')?.value
    const whenIsAHalf = this.hourAHalfForm.get('whenIsAHalf')?.value
    const subtract = this.hourAHalfForm.get('subtract')?.value
      ? this.hourAHalfForm.get('subtract')?.value
      : '0'
    const subtractMinutes = this.hourAHalfForm.get('subtractMinutes')?.value
      ? this.hourAHalfForm.get('subtractMinutes')?.value
      : '0'

    return {
      static_descriptionCost: `Costo por hora: ${this.currencyPipe.transform(
        costHour,
        'GTQ'
      )} Costo por fracción: ${this.currencyPipe.transform(
        costAHalf,
        'GTQ'
      )}. Comenzando a cobrar desde el minuto ${whenIsAHalf}.
      Se le resta ${subtract} horas al cobro.`,
      costHour,
      costAHalf,
      whenIsAHalf,
      subtract,
      subtractMinutes
    }
  }

  get globalScheduleFormValues(): RankInputModel {
    const fromTime: Time = {
      hours: this.getHour(this.principalScheduleForm.get('from')?.value),
      minutes: this.getMinutes(this.principalScheduleForm.get('from')?.value)
    }
    const toTime: Time = {
      hours: this.getHour(this.principalScheduleForm.get('to')?.value),
      minutes: this.getMinutes(this.principalScheduleForm.get('to')?.value)
    }
    const fromTimeDesc = this.toConvert24(
      this.principalScheduleForm.get('from')?.value
    )
    const toTimeDesc = this.toConvert24(
      this.principalScheduleForm.get('to')?.value
    )
    return {
      static_descriptionTime: `Horario Global: Desde: ${fromTimeDesc} Hasta: ${toTimeDesc}.`,
      fromTime,
      toTime
    }
  }

  get defaultFormValues() {
    return {
      static_descriptionTime: `Tarifa por defecto.`
    }
  }

  get fixedCostFormValue(): FixedCostInputModel {
    const fixedCost = this.fixedCostForm.get('fixedCost')?.value
    const whenIsAHalf = this.fixedCostForm.get('whenIsAHalf')?.value
    const subtract = this.fixedCostForm.get('subtract')?.value
      ? this.hourAHalfForm.get('subtract')?.value
      : '0'
    const subtractMinutes = this.fixedCostForm.get('subtractMinutes')?.value
      ? this.fixedCostForm.get('subtractMinutes')?.value
      : '0'
    return {
      static_descriptionCost: `Único pago o Tarifa única: ${this.currencyPipe.transform(
        fixedCost,
        'GTQ'
      )}. Cobrar desde el minuto ${whenIsAHalf}. Se le resta ${subtract} horas al cobro.`,
      fixedCost,
      whenIsAHalf,
      subtract,
      subtractMinutes
    }
  }

  get isValidGeneralData() {
    return this.generalDataForm.valid
  }

  get formTimeRangeSelected() {
    switch (this.timeRange) {
      case 1:
        return this.holidayForm
      case 2:
        return this.rankForm
      case 3:
        return this.blockForm
      case 4:
        return this.defaultForm
      default:
        return null
    }
  }

  get formValueTimeRangeSelected():
    | HolidayInputModel
    | RankInputModel
    | BlockInputModel
    | DefaultInputModel {
    switch (this.timeRange) {
      case 1:
        return this.holidayFormValues
      case 2:
        return this.rankFormValues
      case 3:
        return this.blockFormValues
      case 4:
        return this.defaultFormValues
      default:
        throw new Error(
          'No se pudo obtener los datos de los rangos de tiempo. Por favor intentar nuevamente.'
        )
    }
  }

  get formCostTypeSelected() {
    switch (this.costType) {
      case 1:
        return this.hourAHalfForm
      case 2:
        return this.fixedCostForm
      default:
        return null
    }
  }

  get ifHaveTariffData() {
    return this.tariffs && this.tariffs?.length > 0
  }

  get dailyFormValues(): DailyInputModel {
    return {
      costPerDay: this.dailyForm.get('costPerDay')?.value
    }
  }

  get DailyRules() {
    if (this.generalDataFormValues.isPerDayCondition == true) {
      return [
        {
          conditions: {
            all: TariffComponent.getDailyConditions()
          },
          event: {
            ...this.getDailyEvent()
          }
        }
      ]
    }
    return []
  }

  get FractionOrFixedRules() {
    return [
      {
        conditions: {
          all: this.getConditions()
        },
        event: {
          ...this.getEvent()
        }
      }
    ]
  }

  get HourRules() {
    if (this.costType == 1) {
      return [
        {
          conditions: {
            all: this.getHourConditions()
          },
          event: {
            ...this.getHourEvent()
          }
        }
      ]
    }
    return []
  }

  private static getDailyConditions(): All[] {
    return [...BuildRulesService.getDaily()]
  }

  ifHaveAction(action: string) {
    return this.permissionService.ifHaveAction(action)
  }

  getHour(time: string): number {
    return Number(time.split(':')[0])
  }

  getMinutes(time: string): number {
    return Number(time.split(':')[1])
  }

  toConvert24(time24: string) {
    let ts = time24
    const H = +ts.substr(0, 2)
    let h: string | number = H % 12 || 12
    h = h < 10 ? '0' + h : h // leading 0 at the left for 1 digit hours
    const ampm = H < 12 ? ' AM' : ' PM'
    ts = h + ts.substr(2, 3) + ampm
    return ts
  }

  ngOnInit(): void {
    this.generalDataForm.get('parkingId')?.setValue(this.parkingId)
    if (!this.isCreatingParking) {
      this.authService.user$.subscribe(({ parkingId }) => {
        this.parkingId = parkingId
        this.generalDataForm.get('parkingId')?.setValue(parkingId)
        this.getTariffs().then()
      })
    }
  }

  markAsUntouchedAllForms() {
    this.utilitiesService.markAsUnTouched(this.generalDataForm)
    this.utilitiesService.markAsUnTouched(this.holidayForm)
    this.utilitiesService.markAsUnTouched(this.rankForm)
    this.utilitiesService.markAsUnTouched(this.blockForm)
    this.utilitiesService.markAsUnTouched(this.defaultForm)
    this.utilitiesService.markAsUnTouched(this.dailyForm)
    this.utilitiesService.markAsUnTouched(this.prioriceForm)
    this.utilitiesService.markAsUnTouched(this.daysSelectedForm)
    this.utilitiesService.markAsUnTouched(this.principalScheduleForm)
    this.utilitiesService.markAsUnTouched(this.hourAHalfForm)
    this.utilitiesService.markAsUnTouched(this.fixedCostForm)
  }

  cleanForms() {
    this.generalDataForm.reset()
    this.generalDataForm.controls['isShowDescription'].setValue(true)
    this.generalDataForm.controls['parkingId'].setValue(this.parkingId)
    this.markAsUntouchedAllForms()
    this.utilitiesService.markAsUnTouched(this.generalDataForm)
    this.utilitiesService.markAsUnTouched(this.generalDataForm)
    this.holidayForm.setValue({
      from: '',
      to: ''
    })
    this.rankForm.setValue({
      from: '',
      to: ''
    })
    this.blockForm.setValue({
      hourLowerLimit: '',
      hourUpperLimit: '',
      minuteLowerLimit: '',
      minuteUpperLimit: ''
    })
    this.principalScheduleForm.setValue({
      from: '',
      to: ''
    })
    this.hourAHalfForm.setValue({
      hourCost: '',
      halfCost: '',
      whenIsAHalf: '1',
      subtract: '0',
      subtractMinutes: '0'
    })
    this.fixedCostForm.setValue({
      fixedCost: '',
      whenIsAHalf: '1',
      subtract: '0',
      subtractMinutes: '0'
    })
    this.costType = 1
  }

  emmitStep(number: number) {
    this.messageService.showLoading()
    this.changeStep.emit(number)
    this.messageService.OkTimeOut()
  }

  deleteTariff(id: string) {
    this.messageService.showLoading()
    this.parkingService
      .deleteTariff(id)
      .then((data) => {
        if (!data.success) this.messageService.error('', data.message)

        return data
      })
      .then((data) => {
        if (data.success) {
          this.getTariffs().catch()
          this.messageService.OkTimeOut()
        }
      })
  }

  changeTimeRange(timeRange: number) {
    this.timeRange = timeRange
  }

  async getTariffs() {
    this.messageService.showLoading()
    if (this.isSudo) this.parkingId = this.generalDataFormValues.parkingId
    return this.parkingService
      .getTariffsSaved(this.parkingId)
      .then((data) => {
        if (data.success) {
          this.tariffs = data.data.rules
        }
      })
      .then(() => this.messageService.hideLoading())
  }

  saveRule() {
    const isValid = this.validateForms()
    if (!isValid) return
    const newRule = this.buildTariffJsonRules()
    if (!newRule.rules) {
      this.messageService.error(
        '',
        'No pudo obtenerse la tarifa para ser guardada.'
      )
      return
    }
    this.messageService.showLoading()
    this.parkingService
      .setRule(newRule)
      .then((data) => {
        if (data.success) {
          this.messageService.OkTimeOut()
        } else {
          this.messageService.error('', data.message)
        }
        return data
      })
      .then(() => {
        this.getTariffs().catch()
        this.cleanForms()
      })
      .catch((e) => {
        throw new Error(e.message)
      })
  }

  validateForms() {
    if (this.generalDataFormValues.isPerDayCondition) {
      if (
        this.dailyFormValues.costPerDay < 0 ||
        !this.dailyFormValues.costPerDay
      ) {
        this.messageService.error(
          'Debe escribir una cantidad valida en el costo por día'
        )
        return false
      }
      return true
    }
    const result = this.formTimeRangeSelected?.valid
    if (
      this.principalScheduleForm?.errors?.datesInvalid &&
      this.hasGlobalSchedule
    ) {
      this.messageService.error(
        'Error en Horario global',
        'La segunda fecha "Hasta" debe ser mayor a la fecha "Desde".'
      )
      this.utilitiesService.markAsInvalid(this.principalScheduleForm, 'to', {
        datesInvalid: true
      })
      return false
    }
    if (this.daysFormValues.length < 1) {
      this.messageService.error(
        'No se seleccionaron dias',
        'Debe seleccionar al menos un dia.'
      )
      return false
    }
    if (!result) {
      if (this.formTimeRangeSelected?.errors?.datesInvalid) {
        this.messageService.error(
          'Error en Rangos',
          'La segunda fecha "Hasta" debe ser mayor a la fecha "Desde".'
        )
        this.utilitiesService.markAsInvalid(this.formTimeRangeSelected, 'to', {
          datesInvalid: true
        })
        return false
      }
      if (this.formTimeRangeSelected?.errors?.quantitiesInvalid) {
        this.messageService.error(
          'Error en Rangos',
          'El limite inferior es mayor al limite superior.'
        )
        this.utilitiesService.markAsInvalid(this.formTimeRangeSelected, 'to', {
          quantitiesInvalid: true
        })
        return false
      }
      this.messageService.error(
        '',
        'Formulario de Rangos inválido. Por favor validar que los datos sean correctos.'
      )
      return false
    }
    if (!this.isValidGeneralData) {
      this.messageService.error(
        '',
        'Formulario de datos generales inválido. Por favor validar que los datos sean correctos.'
      )
      return false
    }

    if (this.formCostTypeSelected?.invalid) {
      this.messageService.error(
        'Tipo de costo incorrecto',
        'Hace falta datos o no son correctos'
      )
      return false
    }
    return true
  }

  changeStatusTariff(tariff: any) {
    this.messageService.showLoading()
    this.parkingService
      .tariffStatusUpdate(tariff.id, !tariff.isActive)
      .then((x: any) => {
        if (x.success) {
          this.getTariffs().then(() => this.messageService.OkTimeOut())
        } else {
          this.messageService.error(x.message)
        }
      })
  }

  private otherConditions() {
    let conditions: All[] = []
    if (this.costType == 1) {
      conditions.push(
        ...BuildRulesService.beginChargingWhen(
          this.hourHalfFormValues.whenIsAHalf
        )
      )
    } else if (this.costType == 2) {
      conditions.push(
        ...BuildRulesService.beginChargingWhen(
          this.fixedCostFormValue.whenIsAHalf
        )
      )
    }

    return conditions
  }

  private getConditions(): All[] {
    return [
      ...this.getRangesOfTime(),
      ...this.getGlobalSchedule(),
      ...this.getDays(),
      ...this.otherConditions()
    ]
  }

  private buildTariffJsonRules() {
    try {
      let newRule: CreateTariffModel
      let rules: Rules[] = []
      if (this.generalDataFormValues.isPerDayCondition) {
        rules = [...this.DailyRules]
      } else {
        rules = [...this.FractionOrFixedRules, ...this.HourRules]
      }

      newRule = {
        ...this.generalDataFormValues,
        parking: this.parkingId,
        rules
      }
      newRule.static_description = this.getStaticDescription()
      return newRule
    } catch (ex: any) {
      throw new Error(ex.message)
    }
  }

  private getHourConditions(): All[] {
    return [
      ...this.getRangesOfTime(1),
      ...this.getGlobalSchedule(),
      ...this.getDays()
    ]
  }

  private getRangesOfTime(isHour: number = 0): All[] {
    if (this.prioriceTime == 1) {
      //Prioritizing input
      switch (this.timeRange) {
        case 1:
          return BuildRulesService.getHolidayIn(this.holidayFormValues)
        case 2:
          return BuildRulesService.getRanksOrScheduleIn(
            this.rankFormValues,
            isHour
          )
      }
    }
    if (this.prioriceTime == 2) {
      //Prioritizing output
      switch (this.timeRange) {
        case 1:
          return BuildRulesService.getHolidayOut(this.holidayFormValues)
        case 2:
          return BuildRulesService.getRanksOrScheduleOut(
            this.rankFormValues,
            isHour
          )
      }
    }
    if (this.timeRange == 3) {
      return BuildRulesService.getBlock(this.blockFormValues, isHour)
    }
    if (this.timeRange == 4) {
      return []
    }
    throw new Error('Error al obtener los datos de rango de tiempo.')
  }

  private getGlobalSchedule() {
    if (this.generalDataFormValues.hasGlobalSchedule) {
      return BuildRulesService.getGlobalSchedule(this.globalScheduleFormValues)
    }
    return []
  }

  private getDays() {
    return this.prioriceTime == 1
      ? BuildRulesService.getDaysIn(this.daysFormValues)
      : BuildRulesService.getDaysOut(this.daysFormValues)
  }

  private getEvent(): IEvent {
    return this.costType == 1
      ? BuildRulesService.getHourOrHalfEvent(this.hourHalfFormValues)
      : BuildRulesService.getFixedPriceEvent(this.fixedCostFormValue)
  }

  private getHourEvent(): IEvent {
    return BuildRulesService.getHourOrHalfEvent(this.hourHalfFormValues, 1)
  }

  private getDailyEvent(): IEvent {
    return BuildRulesService.getDailyEvent(this.dailyFormValues)
  }

  private getStaticDescription() {
    if (this.generalDataFormValues.isPerDayCondition) {
      return `Costo por dia: ${this.currencyPipe.transform(
        this.dailyFormValues.costPerDay,
        'GTQ'
      )}`
    }
    let static_description = `${this.prioriceDescription} `
    static_description +=
      this.hasGlobalSchedule == true
        ? `${this.globalScheduleFormValues.static_descriptionTime} `
        : ''
    static_description += `Los dias: ${this.daysValuesDescription.toString()} `
    static_description += `${this.formValueTimeRangeSelected.static_descriptionTime} `
    static_description +=
      this.costType == 1
        ? this.hourHalfFormValues.static_descriptionCost
        : this.fixedCostFormValue.static_descriptionCost
    return static_description
  }
}
