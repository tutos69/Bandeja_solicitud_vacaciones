import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../vacation-request.test-samples';

import { VacationRequestFormService } from './vacation-request-form.service';

describe('VacationRequest Form Service', () => {
  let service: VacationRequestFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VacationRequestFormService);
  });

  describe('Service methods', () => {
    describe('createVacationRequestFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVacationRequestFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            requestedDays: expect.any(Object),
            status: expect.any(Object),
            approverComment: expect.any(Object),
            approvedStartDate: expect.any(Object),
            approvedEndDate: expect.any(Object),
            approvedDays: expect.any(Object),
            createdAt: expect.any(Object),
            decidedAt: expect.any(Object),
            employee: expect.any(Object),
            approver: expect.any(Object),
          }),
        );
      });

      it('passing IVacationRequest should create a new form with FormGroup', () => {
        const formGroup = service.createVacationRequestFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            requestedDays: expect.any(Object),
            status: expect.any(Object),
            approverComment: expect.any(Object),
            approvedStartDate: expect.any(Object),
            approvedEndDate: expect.any(Object),
            approvedDays: expect.any(Object),
            createdAt: expect.any(Object),
            decidedAt: expect.any(Object),
            employee: expect.any(Object),
            approver: expect.any(Object),
          }),
        );
      });
    });

    describe('getVacationRequest', () => {
      it('should return NewVacationRequest for default VacationRequest initial value', () => {
        const formGroup = service.createVacationRequestFormGroup(sampleWithNewData);

        const vacationRequest = service.getVacationRequest(formGroup) as any;

        expect(vacationRequest).toMatchObject(sampleWithNewData);
      });

      it('should return NewVacationRequest for empty VacationRequest initial value', () => {
        const formGroup = service.createVacationRequestFormGroup();

        const vacationRequest = service.getVacationRequest(formGroup) as any;

        expect(vacationRequest).toMatchObject({});
      });

      it('should return IVacationRequest', () => {
        const formGroup = service.createVacationRequestFormGroup(sampleWithRequiredData);

        const vacationRequest = service.getVacationRequest(formGroup) as any;

        expect(vacationRequest).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVacationRequest should not enable id FormControl', () => {
        const formGroup = service.createVacationRequestFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVacationRequest should disable id FormControl', () => {
        const formGroup = service.createVacationRequestFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
