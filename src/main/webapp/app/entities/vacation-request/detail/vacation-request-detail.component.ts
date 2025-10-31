import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IVacationRequest } from '../vacation-request.model';

@Component({
  selector: 'jhi-vacation-request-detail',
  templateUrl: './vacation-request-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class VacationRequestDetailComponent {
  vacationRequest = input<IVacationRequest | null>(null);

  previousState(): void {
    window.history.back();
  }
}
