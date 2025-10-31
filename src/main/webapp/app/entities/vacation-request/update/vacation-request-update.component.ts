import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { VacationStatus } from 'app/entities/enumerations/vacation-status.model';
import { VacationRequestService } from '../service/vacation-request.service';
import { IVacationRequest } from '../vacation-request.model';
import { VacationRequestFormGroup, VacationRequestFormService } from './vacation-request-form.service';

// Roles JHipster
import { AccountService } from 'app/core/auth/account.service';
import { Authority } from 'app/config/authority.constants';

@Component({
  selector: 'jhi-vacation-request-update',
  templateUrl: './vacation-request-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class VacationRequestUpdateComponent implements OnInit {
  isSaving = false;
  vacationRequest: IVacationRequest | null = null;
  vacationStatusValues = Object.keys(VacationStatus);

  employeesSharedCollection: IEmployee[] = [];
  usersSharedCollection: IUser[] = [];

  // Cálculos
  employeeHireDate: dayjs.Dayjs | null = null;
  yearsOfSeniority = 0;
  availableDays = 0;

  // Rol / usuario actual
  isAdmin = false;
  private accountLogin: string | null = null; // login del usuario autenticado
  private currentUser: IUser | null = null; // IUser del autenticado (para setear como approver)

  // Snapshot de campos protegidos (para NO admin)
  private originalProtected = {
    status: undefined as IVacationRequest['status'],
    approverComment: null as string | null,
    approver: null as IUser | null,
    approvedStartDate: null as dayjs.Dayjs | null,
  };

  protected vacationRequestService = inject(VacationRequestService);
  protected vacationRequestFormService = inject(VacationRequestFormService);
  protected employeeService = inject(EmployeeService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);
  protected accountService = inject(AccountService);

  editForm: VacationRequestFormGroup = this.vacationRequestFormService.createVacationRequestFormGroup();

  compareEmployee = (o1: IEmployee | null, o2: IEmployee | null): boolean => this.employeeService.compareEmployee(o1, o2);
  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    // Intento rápido (si existe hasAnyAuthority)
    try {
      // @ts-ignore
      this.isAdmin = !!this.accountService?.hasAnyAuthority?.(Authority.ADMIN);
    } catch {}

    // Identidad (obtenemos login y rol)
    this.accountService.identity().subscribe(account => {
      this.accountLogin = account?.login ?? null;
      this.isAdmin = !!account?.authorities?.includes(Authority.ADMIN);

      // Cargar lista de usuarios y resolver el usuario actual (según login)
      this.userService
        .query()
        .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
        .subscribe(users => {
          this.usersSharedCollection = users;
          this.currentUser = this.accountLogin ? (users.find(u => u.login === this.accountLogin) ?? null) : null;

          // Habilitar/deshabilitar
          if (!this.isAdmin) {
            this.editForm.get('status')?.disable({ emitEvent: false });
            this.editForm.get('approverComment')?.disable({ emitEvent: false });
            this.editForm.get('approver')?.disable({ emitEvent: false });
            this.editForm.get('approvedStartDate')?.disable({ emitEvent: false });
          } else {
            this.editForm.get('status')?.enable({ emitEvent: false });
            this.editForm.get('approverComment')?.enable({ emitEvent: false });
            this.editForm.get('approver')?.enable({ emitEvent: false });
            this.editForm.get('approvedStartDate')?.enable({ emitEvent: false });
          }
        });
    });

    // Entidad
    this.activatedRoute.data.subscribe(({ vacationRequest }) => {
      this.vacationRequest = vacationRequest;
      if (vacationRequest) {
        this.updateForm(vacationRequest);
      } else {
        // valores por defecto de snapshot al crear
        this.originalProtected = {
          status: 'PENDING' as keyof typeof VacationStatus,
          approverComment: null,
          approver: null,
          approvedStartDate: null,
        };
      }
      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  onEmployeeChange(): void {
    const selectedEmployee = this.editForm.get('employee')?.value;
    if (selectedEmployee?.id) {
      this.employeeService.find(selectedEmployee.id).subscribe({
        next: (res: HttpResponse<IEmployee>) => {
          const full = res.body;
          if (full?.startDate) {
            this.employeeHireDate = dayjs(full.startDate);
            this.calculateYearsOfSeniority();
            this.calculateAvailableDays();
          }
        },
        error: () => {
          this.employeeHireDate = null;
          this.yearsOfSeniority = 0;
          this.availableDays = 0;
        },
      });
    } else {
      this.employeeHireDate = null;
      this.yearsOfSeniority = 0;
      this.availableDays = 0;
    }
  }

  private calculateYearsOfSeniority(): void {
    if (!this.employeeHireDate) {
      this.yearsOfSeniority = 0;
      return;
    }
    const today = dayjs();
    const hire = this.employeeHireDate;
    let years = today.year() - hire.year();
    const monthDiff = today.month() - hire.month();
    if (monthDiff < 0 || (monthDiff === 0 && today.date() < hire.date())) years--;
    this.yearsOfSeniority = years;
  }

  private calculateAvailableDays(): void {
    if (this.yearsOfSeniority < 1) this.availableDays = 0;
    else if (this.yearsOfSeniority <= 5) this.availableDays = 10;
    else this.availableDays = 20;
  }

  onStartDateChange(): void {
    const startCtrl = this.editForm.get('startDate');
    const endCtrl = this.editForm.get('endDate');
    const reqCtrl = this.editForm.get('requestedDays');

    const startVal = startCtrl?.value;
    const endVal = endCtrl?.value;

    if (this.availableDays === 0) {
      endCtrl?.setValue(null, { emitEvent: false });
      reqCtrl?.setValue(0, { emitEvent: false });
      return;
    }

    const isStruct = (v: any): v is { year: number; month: number; day: number } =>
      !!v && typeof v.year === 'number' && typeof v.month === 'number' && typeof v.day === 'number';

    if (startVal && endVal) {
      const start = isStruct(startVal) ? dayjs(new Date(startVal.year, startVal.month - 1, startVal.day)) : dayjs(startVal);
      const end = isStruct(endVal) ? dayjs(new Date(endVal.year, endVal.month - 1, endVal.day)) : dayjs(endVal);

      const prev = endCtrl?.errors || {};
      delete (prev as any)['invalidRange'];
      delete (prev as any)['exceedsAvailable'];
      endCtrl?.setErrors(Object.keys(prev).length ? prev : null);

      if (end.isBefore(start, 'day')) {
        reqCtrl?.setValue(0, { emitEvent: false });
        endCtrl?.setErrors({ ...(endCtrl?.errors || {}), invalidRange: true });
        return;
      }

      const days = this.calculateBusinessDays(start, end);
      reqCtrl?.setValue(days, { emitEvent: false });

      if (days > this.availableDays) {
        endCtrl?.setErrors({ ...(endCtrl?.errors || {}), exceedsAvailable: true });
      }
      return;
    }

    if (startVal) {
      const startDate = isStruct(startVal) ? dayjs(new Date(startVal.year, startVal.month - 1, startVal.day)) : dayjs(startVal);

      let endDate = startDate;
      let daysAdded = 0;
      while (daysAdded < this.availableDays) {
        endDate = endDate.add(1, 'day');
        const dow = endDate.day();
        if (dow !== 0 && dow !== 6) daysAdded++;
      }
      endDate = endDate.subtract(1, 'day');

      const endStruct = { year: endDate.year(), month: endDate.month() + 1, day: endDate.date() };
      (endCtrl as any)?.setValue(endStruct as any, { emitEvent: false });
      reqCtrl?.setValue(this.availableDays, { emitEvent: false });
      return;
    }

    reqCtrl?.setValue(0, { emitEvent: false });
  }

  private calculateBusinessDays(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs): number {
    let count = 0;
    let current = startDate;
    while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
      const dow = current.day();
      if (dow !== 0 && dow !== 6) count++;
      current = current.add(1, 'day');
    }
    return count;
  }

  save(): void {
    this.isSaving = true;
    const vacationRequest = this.vacationRequestFormService.getVacationRequest(this.editForm);

    // ====== CREATE ======
    if (vacationRequest.id === null) {
      vacationRequest.createdAt = dayjs();
      vacationRequest.status = 'PENDING' as keyof typeof VacationStatus;

      // requestedDays
      if (vacationRequest.startDate && vacationRequest.endDate) {
        vacationRequest.requestedDays = this.calculateBusinessDays(
          vacationRequest.startDate as any as dayjs.Dayjs,
          vacationRequest.endDate as any as dayjs.Dayjs,
        );
      } else {
        vacationRequest.requestedDays = this.availableDays;
      }

      if (this.isAdmin) {
        // Solo ADMIN: setear approver = usuario logeado
        if (this.currentUser) {
          (vacationRequest as any).approver = this.currentUser;
        }
        // Si crea y ya marca APPROVED, setear fecha de autorización = hoy
        if (vacationRequest.status === ('APPROVED' as any)) {
          (vacationRequest as any).approvedStartDate = dayjs();
        }
      } else {
        // NO ADMIN: no puede tocar approver ni approvedStartDate
        (vacationRequest as any).approver = null;
        (vacationRequest as any).approvedStartDate = null;
        vacationRequest.status = 'PENDING' as any;
      }

      this.subscribeToSaveResponse(this.vacationRequestService.create(vacationRequest));
      return;
    }

    // ====== UPDATE ======
    if (this.vacationRequest?.createdAt) {
      vacationRequest.createdAt = this.vacationRequest.createdAt;
    }

    if (this.isAdmin) {
      // ADMIN: forzamos approver = usuario logeado siempre que exista
      if (this.currentUser) {
        (vacationRequest as any).approver = this.currentUser;
      }
      // Si lo deja en APPROVED y no tiene fecha, o cambia a APPROVED, setea hoy
      const becameApproved = this.vacationRequest?.status !== ('APPROVED' as any) && vacationRequest.status === ('APPROVED' as any);
      const hasNoApprovedDate = !(vacationRequest as any).approvedStartDate;
      if (vacationRequest.status === ('APPROVED' as any) && (becameApproved || hasNoApprovedDate)) {
        (vacationRequest as any).approvedStartDate = dayjs();
      }
    } else {
      // NO ADMIN: mantener valores originales protegidos
      vacationRequest.status = this.originalProtected.status;
      (vacationRequest as any).approverComment = this.originalProtected.approverComment;
      (vacationRequest as any).approver = this.originalProtected.approver;
      (vacationRequest as any).approvedStartDate = this.originalProtected.approvedStartDate;
    }

    this.subscribeToSaveResponse(this.vacationRequestService.update(vacationRequest));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVacationRequest>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }
  protected onSaveError(): void {}
  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(vacationRequest: IVacationRequest): void {
    this.vacationRequest = vacationRequest;
    this.vacationRequestFormService.resetForm(this.editForm, vacationRequest);

    // Employees
    this.employeesSharedCollection = this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(
      this.employeesSharedCollection,
      vacationRequest.employee as IEmployee,
    );

    // Cargar datos del empleado para cálculos
    if (vacationRequest.employee?.id) {
      this.employeeService.find(vacationRequest.employee.id).subscribe({
        next: (res: HttpResponse<IEmployee>) => {
          const full = res.body;
          if (full?.startDate) {
            this.employeeHireDate = dayjs(full.startDate);
            this.calculateYearsOfSeniority();
            this.calculateAvailableDays();
          }
        },
      });
    }

    // Snapshot
    this.originalProtected = {
      status: vacationRequest.status ?? ('PENDING' as keyof typeof VacationStatus),
      // @ts-ignore
      approverComment: (vacationRequest as any).approverComment ?? null,
      // @ts-ignore
      approver: (vacationRequest as any).approver ?? null,
      // @ts-ignore
      approvedStartDate: (vacationRequest as any).approvedStartDate ?? null,
    };

    // Bloqueo UI si no es admin
    if (!this.isAdmin) {
      this.editForm.get('status')?.disable({ emitEvent: false });
      this.editForm.get('approverComment')?.disable({ emitEvent: false });
      this.editForm.get('approver')?.disable({ emitEvent: false });
      this.editForm.get('approvedStartDate')?.disable({ emitEvent: false });
    }
  }

  protected loadRelationshipsOptions(): void {
    // Employees
    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployee[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployee[]) =>
          this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(employees, this.vacationRequest?.employee),
        ),
      )
      .subscribe((employees: IEmployee[]) => (this.employeesSharedCollection = employees));

    // Users (ya se carga también en identity() para resolver currentUser)
    if (this.usersSharedCollection.length === 0) {
      this.userService
        .query()
        .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
        .subscribe(users => (this.usersSharedCollection = users));
    }
  }

  get canSave(): boolean {
    const emp = this.editForm.get('employee')!;
    const start = this.editForm.get('startDate')!;
    const end = this.editForm.get('endDate')!;
    const endHasErrors = !!end.errors;
    return !!emp.value && !!start.value && !!end.value && !endHasErrors && this.availableDays > 0;
  }
}
