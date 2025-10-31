import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IVacationRequest } from '../vacation-request.model';
import { VacationRequestService } from '../service/vacation-request.service';
import { VacationRequestFormService } from './vacation-request-form.service';

import { VacationRequestUpdateComponent } from './vacation-request-update.component';

describe('VacationRequest Management Update Component', () => {
  let comp: VacationRequestUpdateComponent;
  let fixture: ComponentFixture<VacationRequestUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let vacationRequestFormService: VacationRequestFormService;
  let vacationRequestService: VacationRequestService;
  let employeeService: EmployeeService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VacationRequestUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(VacationRequestUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VacationRequestUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vacationRequestFormService = TestBed.inject(VacationRequestFormService);
    vacationRequestService = TestBed.inject(VacationRequestService);
    employeeService = TestBed.inject(EmployeeService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Employee query and add missing value', () => {
      const vacationRequest: IVacationRequest = { id: 12195 };
      const employee: IEmployee = { id: 1749 };
      vacationRequest.employee = employee;

      const employeeCollection: IEmployee[] = [{ id: 1749 }];
      jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const additionalEmployees = [employee];
      const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
      jest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ vacationRequest });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(
        employeeCollection,
        ...additionalEmployees.map(expect.objectContaining),
      );
      expect(comp.employeesSharedCollection).toEqual(expectedCollection);
    });

    it('should call User query and add missing value', () => {
      const vacationRequest: IVacationRequest = { id: 12195 };
      const approver: IUser = { id: 3944 };
      vacationRequest.approver = approver;

      const userCollection: IUser[] = [{ id: 3944 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [approver];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ vacationRequest });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const vacationRequest: IVacationRequest = { id: 12195 };
      const employee: IEmployee = { id: 1749 };
      vacationRequest.employee = employee;
      const approver: IUser = { id: 3944 };
      vacationRequest.approver = approver;

      activatedRoute.data = of({ vacationRequest });
      comp.ngOnInit();

      expect(comp.employeesSharedCollection).toContainEqual(employee);
      expect(comp.usersSharedCollection).toContainEqual(approver);
      expect(comp.vacationRequest).toEqual(vacationRequest);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVacationRequest>>();
      const vacationRequest = { id: 10483 };
      jest.spyOn(vacationRequestFormService, 'getVacationRequest').mockReturnValue(vacationRequest);
      jest.spyOn(vacationRequestService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vacationRequest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vacationRequest }));
      saveSubject.complete();

      // THEN
      expect(vacationRequestFormService.getVacationRequest).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(vacationRequestService.update).toHaveBeenCalledWith(expect.objectContaining(vacationRequest));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVacationRequest>>();
      const vacationRequest = { id: 10483 };
      jest.spyOn(vacationRequestFormService, 'getVacationRequest').mockReturnValue({ id: null });
      jest.spyOn(vacationRequestService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vacationRequest: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vacationRequest }));
      saveSubject.complete();

      // THEN
      expect(vacationRequestFormService.getVacationRequest).toHaveBeenCalled();
      expect(vacationRequestService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVacationRequest>>();
      const vacationRequest = { id: 10483 };
      jest.spyOn(vacationRequestService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vacationRequest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vacationRequestService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEmployee', () => {
      it('should forward to employeeService', () => {
        const entity = { id: 1749 };
        const entity2 = { id: 1545 };
        jest.spyOn(employeeService, 'compareEmployee');
        comp.compareEmployee(entity, entity2);
        expect(employeeService.compareEmployee).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUser', () => {
      it('should forward to userService', () => {
        const entity = { id: 3944 };
        const entity2 = { id: 6275 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
