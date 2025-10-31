import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import VacationRequestResolve from './route/vacation-request-routing-resolve.service';

const vacationRequestRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/vacation-request.component').then(m => m.VacationRequestComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/vacation-request-detail.component').then(m => m.VacationRequestDetailComponent),
    resolve: {
      vacationRequest: VacationRequestResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/vacation-request-update.component').then(m => m.VacationRequestUpdateComponent),
    resolve: {
      vacationRequest: VacationRequestResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/vacation-request-update.component').then(m => m.VacationRequestUpdateComponent),
    resolve: {
      vacationRequest: VacationRequestResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default vacationRequestRoute;
