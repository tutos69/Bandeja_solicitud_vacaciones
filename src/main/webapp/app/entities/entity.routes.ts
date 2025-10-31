import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'vacacionesApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'employee',
    data: { pageTitle: 'vacacionesApp.employee.home.title' },
    loadChildren: () => import('./employee/employee.routes'),
  },
  {
    path: 'vacation-request',
    data: { pageTitle: 'vacacionesApp.vacationRequest.home.title' },
    loadChildren: () => import('./vacation-request/vacation-request.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
