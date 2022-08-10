import {environment} from 'src/environments/environment'
import {PermissionsService} from './../../../../../shared/services/permissions.service'
import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {UtilitiesService} from '../../../../../shared/services/utilities.service'
import {CompaniesService} from '../../users/services/companies.service'
import {AuthService} from '../../../../../shared/services/auth.service'
import {Subject} from 'rxjs'
import {NewUserModel} from '../../users/models/newUserModel'
import {DataTableDirective} from 'angular-datatables'
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms'
import {DataTableOptions} from '../../../../../shared/model/DataTableOptions'
import {CompaniesModel} from '../../users/models/companies.model'
import {ParkingService} from '../../../../parking/services/parking.service'
import {ParkingModel} from '../../../../parking/models/Parking.model'
import {MessageService} from '../../../../../shared/services/message.service'

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements AfterViewInit, OnDestroy, OnInit {
  idCompanyToEdit = ''
  companiesForm: UntypedFormGroup
  companies: CompaniesModel[] = []
  states: Array<any> = this.companyService.states
  allParkingLot: ParkingModel[] = []
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective
  /*Table*/
  @Input() subject: Subject<NewUserModel> = new Subject<NewUserModel>()
  dtTrigger: Subject<any> = new Subject()
  formGroup: UntypedFormGroup
  /* Permissions */
  create: string = environment.createLocal
  disable: string = environment.disableLocal
  edit: string = environment.editLocal
  private parkingId: string = this.authService.getParking().id

  constructor(
    private utilitiesService: UtilitiesService,
    private companyService: CompaniesService,
    private authService: AuthService,
    private formBuilder: UntypedFormBuilder,
    private parkingService: ParkingService,
    private messageService: MessageService,
    private permissionService: PermissionsService
  ) {
    this.formGroup = formBuilder.group({filter: ['']})
    this.companiesForm = this.createCompanyForm()
  }

  get dtOptions() {
    return DataTableOptions.getSpanishOptions(10)
  }

  get formCompanyValues(): CompaniesModel {
    return {
      name: this.companiesForm.get('name')?.value,
      parking: this.parkingId,
      place: this.companiesForm.get('place')?.value,
      status: this.companiesForm.get('status')?.value
    }
  }

  get isSudo() {
    return this.authService.isSudo
  }

  ifHaveAction(action: string) {
    return this.permissionService.ifHaveAction(action)
  }

  editTheCompany(company: CompaniesModel) {
    if (!company.id) {
      this.messageService.error(
        'Esta compañía no existe o no se seleciono una correcta.'
      )
      return
    }
    this.idCompanyToEdit = company.id
    this.companiesForm.get('name')?.setValue(company.name)
    this.companiesForm.get('place')?.setValue(company.place)
    this.companiesForm.get('status')?.setValue(company.status ? 1 : 0)
    this.companiesForm.get('parking')?.setValue(company.parking.id)
  }

  getAndRerender = () => {
    this.getCompanies().then(() => this.rerender())

  }

  async saveCompany() {
    if (this.companiesForm.invalid) {
      this.messageService.error('', 'Datos no válidos o faltantes')
      return
    }
    const newCompany = this.formCompanyValues
    if (this.idCompanyToEdit) {
      newCompany.id = this.idCompanyToEdit
      await this.companyService
        .editCompany(newCompany, this.getAndRerender)
        .toPromise().then(() => this.cleanCompanyForm())
      return
    }
    await this.companyService
      .createCompany(newCompany, this.getAndRerender)
      .toPromise()
      .then(() => this.cleanCompanyForm())

  }

  cleanCompanyForm() {
    this.companiesForm.reset()
    this.idCompanyToEdit = ''
    this.companiesForm.get('status')?.setValue(0)
    this.companiesForm.get('parking')?.setValue(this.parkingId)
  }

  async deleteTheCompany(company: CompaniesModel) {
    if (!company.id) {
      this.messageService.errorTimeOut(
        'Esta compañía no existe o no se seleccionó una correcta.'
      )
      return
    }
    const response = await this.messageService
      .areYouSure(
        `¿Esta seguro que desea deshabilitar ${company.name}?`,
        'Si',
        'No'
      )
      .then((x) => x)
    if (response.isConfirmed) {
      await this.companyService
        .deleteCompany(company.id, this.getAndRerender)
        .toPromise()
    }
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next()
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe()
  }


  private async getInitialData() {
    await this.getCompanies().then(() => this.rerender())
  }

  private async getCompanies(parkingId: string = this.parkingId) {
    return this.companyService
      .getCompanies(this.parkingId)
      .toPromise()
      .then((data) => {
        this.companies = data
      })
  }

  private createCompanyForm() {
    return this.formBuilder.group({
      id: [],
      parking: [this.parkingId, [Validators.required]],
      name: ['', [Validators.required]],
      place: ['', [Validators.required]],
      status: [0, [Validators.required]],
      created_at: ['']
    })
  }

  private rerender() {
    if (this.dtElement != undefined) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy()
        this.dtTrigger.next()
      })
    }
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(({parkingId}) => {
      this.parkingId = parkingId
      this.companiesForm.get('parking')?.setValue(parkingId)
      this.getInitialData().catch()
    })
    this.parkingService.parkingLot$.subscribe((parkingLot) => {
      this.allParkingLot = parkingLot
    })
  }
}
