import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVacationRequest, NewVacationRequest } from '../vacation-request.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVacationRequest for edit and NewVacationRequestFormGroupInput for create.
 */
type VacationRequestFormGroupInput = IVacationRequest | PartialWithRequiredKeyOf<NewVacationRequest>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IVacationRequest | NewVacationRequest> = Omit<T, 'createdAt' | 'decidedAt'> & {
  createdAt?: string | null;
  decidedAt?: string | null;
};

type VacationRequestFormRawValue = FormValueOf<IVacationRequest>;

type NewVacationRequestFormRawValue = FormValueOf<NewVacationRequest>;

type VacationRequestFormDefaults = Pick<NewVacationRequest, 'id' | 'createdAt' | 'decidedAt'>;

type VacationRequestFormGroupContent = {
  id: FormControl<VacationRequestFormRawValue['id'] | NewVacationRequest['id']>;
  startDate: FormControl<VacationRequestFormRawValue['startDate']>;
  endDate: FormControl<VacationRequestFormRawValue['endDate']>;
  requestedDays: FormControl<VacationRequestFormRawValue['requestedDays']>;
  status: FormControl<VacationRequestFormRawValue['status']>;
  approverComment: FormControl<VacationRequestFormRawValue['approverComment']>;
  approvedStartDate: FormControl<VacationRequestFormRawValue['approvedStartDate']>;
  approvedEndDate: FormControl<VacationRequestFormRawValue['approvedEndDate']>;
  approvedDays: FormControl<VacationRequestFormRawValue['approvedDays']>;
  createdAt: FormControl<VacationRequestFormRawValue['createdAt']>;
  decidedAt: FormControl<VacationRequestFormRawValue['decidedAt']>;
  employee: FormControl<VacationRequestFormRawValue['employee']>;
  approver: FormControl<VacationRequestFormRawValue['approver']>;
};

export type VacationRequestFormGroup = FormGroup<VacationRequestFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VacationRequestFormService {
  createVacationRequestFormGroup(vacationRequest: VacationRequestFormGroupInput = { id: null }): VacationRequestFormGroup {
    const vacationRequestRawValue = this.convertVacationRequestToVacationRequestRawValue({
      ...this.getFormDefaults(),
      ...vacationRequest,
    });
    return new FormGroup<VacationRequestFormGroupContent>({
      id: new FormControl(
        { value: vacationRequestRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      startDate: new FormControl(vacationRequestRawValue.startDate, {
        validators: [Validators.required],
      }),
      endDate: new FormControl(vacationRequestRawValue.endDate, {
        validators: [Validators.required],
      }),
      requestedDays: new FormControl(vacationRequestRawValue.requestedDays, {
        validators: [Validators.required],
      }),
      status: new FormControl(vacationRequestRawValue.status, {
        validators: [Validators.required],
      }),
      approverComment: new FormControl(vacationRequestRawValue.approverComment, {
        validators: [Validators.maxLength(500)],
      }),
      approvedStartDate: new FormControl(vacationRequestRawValue.approvedStartDate),
      approvedEndDate: new FormControl(vacationRequestRawValue.approvedEndDate),
      approvedDays: new FormControl(vacationRequestRawValue.approvedDays),
      createdAt: new FormControl(vacationRequestRawValue.createdAt, {
        validators: [Validators.required],
      }),
      decidedAt: new FormControl(vacationRequestRawValue.decidedAt),
      employee: new FormControl(vacationRequestRawValue.employee, {
        validators: [Validators.required],
      }),
      approver: new FormControl(vacationRequestRawValue.approver),
    });
  }

  getVacationRequest(form: VacationRequestFormGroup): IVacationRequest | NewVacationRequest {
    return this.convertVacationRequestRawValueToVacationRequest(
      form.getRawValue() as VacationRequestFormRawValue | NewVacationRequestFormRawValue,
    );
  }

  resetForm(form: VacationRequestFormGroup, vacationRequest: VacationRequestFormGroupInput): void {
    const vacationRequestRawValue = this.convertVacationRequestToVacationRequestRawValue({ ...this.getFormDefaults(), ...vacationRequest });
    form.reset(
      {
        ...vacationRequestRawValue,
        id: { value: vacationRequestRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): VacationRequestFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      decidedAt: currentTime,
    };
  }

  private convertVacationRequestRawValueToVacationRequest(
    rawVacationRequest: VacationRequestFormRawValue | NewVacationRequestFormRawValue,
  ): IVacationRequest | NewVacationRequest {
    return {
      ...rawVacationRequest,
      createdAt: dayjs(rawVacationRequest.createdAt, DATE_TIME_FORMAT),
      decidedAt: dayjs(rawVacationRequest.decidedAt, DATE_TIME_FORMAT),
    };
  }

  private convertVacationRequestToVacationRequestRawValue(
    vacationRequest: IVacationRequest | (Partial<NewVacationRequest> & VacationRequestFormDefaults),
  ): VacationRequestFormRawValue | PartialWithRequiredKeyOf<NewVacationRequestFormRawValue> {
    return {
      ...vacationRequest,
      createdAt: vacationRequest.createdAt ? vacationRequest.createdAt.format(DATE_TIME_FORMAT) : undefined,
      decidedAt: vacationRequest.decidedAt ? vacationRequest.decidedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
