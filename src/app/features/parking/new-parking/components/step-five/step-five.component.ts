import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AccessModel,
  CreateParkingStepFiveModel,
} from '../../../models/CreateParking.model';
import { MessageService } from '../../../../../shared/services/message.service';
import { ParkingService } from '../../../services/parking.service';
import { UtilitiesService } from '../../../../../shared/services/utilities.service';
import { ResponseModel } from '../../../../../shared/model/Request.model';

@Component({
  selector: 'app-step-five',
  templateUrl: './step-five.component.html',
  styleUrls: ['./step-five.component.css'],
})
export class StepFiveComponent implements OnInit {
  @Input() stepFiveForm!: FormGroup;
  @Output() changeStep = new EventEmitter<number>();
  isEditing: boolean = false;
  idParking = this.parkingService.parkingStepOne.parkingId;
  accessList: AccessModel[] = this.parkingService.getAccesses();
  antennas: CreateParkingStepFiveModel[] =
    new Array<CreateParkingStepFiveModel>();

  constructor(
    private formBuilder: FormBuilder,
    private message: MessageService,
    private parkingService: ParkingService,
    private utilitiesService: UtilitiesService
  ) {
    this.getInitialData();
  }

  ngOnInit(): void {}

  getAccessName(type: number): AccessModel {
    let result = this.accessList.find((x) => x.value == type);

    return result === undefined ? new AccessModel() : result;
  }

  controlInvalid(control: string) {
    return this.utilitiesService.controlInvalid(this.stepFiveForm, control);
  }

  private getStepFive(): CreateParkingStepFiveModel {
    return {
      parking: this.parkingService.parkingStepOne.parkingId,
      name: this.stepFiveForm.controls['name_access'].value,
      type: this.stepFiveForm.controls['type_access'].value,
      antena: this.stepFiveForm.controls['antenna_access'].value,
      mac: this.stepFiveForm.controls['mac_access'].value,
    };
  }

  addAntenna() {
    if (this.stepFiveForm.invalid) {
      this.message.warningTimeOut(
        'No ha llenado todos los datos. Para continuar por favor llene los datos necesarios.'
      );
    } else {
      this.message.showLoading();
      if (!this.isEditing) {
        this.parkingService
          .setStepFive(this.getStepFive())
          .then((data: ResponseModel) => {
            if (data.success) {
              this.getInitialData().then(() => {
                this.message.OkTimeOut('Guardado');
              });
            } else {
              this.message.error(
                '',
                'No pudo guardarse la antena, error: ' + data.message
              );
            }
          });
      } else {
        //Edit antenna
      }
    }
  }

  emmitStep(number: number) {
    if (number == 1) {
      if (this.stepFiveForm.valid) {
        let promises = Array<Promise<any>>();
        this.parkingService.parkingStepFive.forEach(
          (antenna: CreateParkingStepFiveModel) => {
            //TODO: No Push a las antenas que ya han sido agregadas.
            promises.push(this.parkingService.setStepFive(antenna));
          }
        );
        Promise.all(promises).then(
          (data) => {
            let allIsRight = true;
            data.forEach((response, i) => {});
            if (allIsRight) {
              this.changeStep.emit(number);
            }
          },
          (err) => {}
        );
      } else {
        this.message.errorTimeOut(
          '',
          'Datos faltantes o incorrectos. Validar que los datos sean correctos.'
        );
      }
    } else {
      this.changeStep.emit(number);
    }
  }

  private getInitialData() {
    return this.parkingService
      .getAntennas(this.idParking)
      .toPromise()
      .then((data: ResponseModel) => {
        if (data.success) {
          this.antennas = [];
          data.data.stations.forEach((station: CreateParkingStepFiveModel) => {
            this.antennas.push(station);
          });
        }
        console.log(data);
        console.log(this.antennas);
      })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }

  editAntenna(antenna: CreateParkingStepFiveModel) {}

  deleteAntenna(antenna: CreateParkingStepFiveModel) {}

  downloadQR(antenna: CreateParkingStepFiveModel) {}
}
