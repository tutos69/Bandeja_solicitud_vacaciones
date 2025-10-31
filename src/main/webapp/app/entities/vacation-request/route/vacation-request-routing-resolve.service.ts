import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVacationRequest } from '../vacation-request.model';
import { VacationRequestService } from '../service/vacation-request.service';

const vacationRequestResolve = (route: ActivatedRouteSnapshot): Observable<null | IVacationRequest> => {
  const id = route.params.id;
  if (id) {
    return inject(VacationRequestService)
      .find(id)
      .pipe(
        mergeMap((vacationRequest: HttpResponse<IVacationRequest>) => {
          if (vacationRequest.body) {
            return of(vacationRequest.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default vacationRequestResolve;
