import { Component, NgZone, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter as rxFilter, tap, switchMap, of, map } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';

import { IVacationRequest } from '../vacation-request.model';
import { EntityArrayResponseType, VacationRequestService } from '../service/vacation-request.service';
import { VacationRequestDeleteDialogComponent } from '../delete/vacation-request-delete-dialog.component';

// Identidad/roles y Employee
import { AccountService } from 'app/core/auth/account.service';
import { Authority } from 'app/config/authority.constants';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { IEmployee } from 'app/entities/employee/employee.model';

@Component({
  selector: 'jhi-vacation-request',
  templateUrl: './vacation-request.component.html',
  imports: [RouterModule, FormsModule, SharedModule, SortDirective, SortByDirective, FormatMediumDatetimePipe, FormatMediumDatePipe],
  standalone: true,
})
export class VacationRequestComponent implements OnInit {
  subscription: Subscription | null = null;
  vacationRequests = signal<IVacationRequest[]>([]);
  isLoading = false;

  sortState = sortStateSignal({});

  public readonly router = inject(Router);
  protected readonly vacationRequestService = inject(VacationRequestService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  protected readonly accountService = inject(AccountService);
  protected readonly employeeService = inject(EmployeeService);

  // Estado para filtrar
  private isAdmin = false;
  private currentEmployeeId: number | null = null;

  trackId = (item: IVacationRequest): number => this.vacationRequestService.getVacationRequestIdentifier(item);

  ngOnInit(): void {
    // 1) Lee sort desde la ruta
    // 2) Resuelve identidad → rol → employeeId (por login)
    // 3) Carga y filtra en cliente según el rol
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        switchMap(() =>
          this.accountService.identity().pipe(
            tap(account => {
              // Si no hay cuenta, tratamos como no-admin sin employee
              this.isAdmin = !!account && this.accountService.hasAnyAuthority(Authority.ADMIN);
            }),
            switchMap(account => {
              // Admin: ve todo, no necesitamos employeeId
              if (!account || this.isAdmin) {
                return of<IEmployee | null>(null);
              }
              // 🔎 Tu relación Employee{user(login)} → busca Employee por login
              return this.employeeService
                .query({ 'userLogin.equals': account.login, size: 1 })
                .pipe(map(res => (res.body && res.body.length ? res.body[0] : null)));
            }),
            tap(emp => {
              // Si el usuario no está registrado como Employee, emp será null
              this.currentEmployeeId = emp?.id ?? null;
            }),
          ),
        ),
        tap(() => this.load()),
      )
      .subscribe();
  }

  delete(vacationRequest: IVacationRequest): void {
    const modalRef = this.modalService.open(VacationRequestDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.vacationRequest = vacationRequest;
    modalRef.closed
      .pipe(
        rxFilter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    // Si NO es admin y aún no conozco su employeeId (o no existe porque no está registrado),
    // mostramos vacío sin pedir todo para evitar “flicker”
    if (!this.isAdmin && this.currentEmployeeId === null) {
      this.vacationRequests.set([]);
      return;
    }

    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => this.onResponseSuccess(res),
    });
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    let data = this.fillComponentAttributesFromResponseBody(response.body);

    // 🚦 FILTRO EN CLIENTE:
    // - Admin: ve todo
    // - No admin: solo registros cuyo employee.id === currentEmployeeId
    if (!this.isAdmin && this.currentEmployeeId != null) {
      data = data.filter(vr => vr.employee?.id === this.currentEmployeeId);
    }
    // Si currentEmployeeId es null (usuario no registrado como Employee), ya devolvemos vacío en load()

    this.vacationRequests.set(this.refineData(data));
  }

  protected refineData(data: IVacationRequest[]): IVacationRequest[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IVacationRequest[] | null): IVacationRequest[] {
    return data ?? [];
  }

  // ⚠️ No enviamos filtros al backend; el filtrado es 100% TS (cliente)
  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      eagerload: true,
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.vacationRequestService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(sortState: SortState): void {
    const queryParamsObj = {
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
