import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IVacationRequest } from '../vacation-request.model';
import { VacationRequestService } from '../service/vacation-request.service';

@Component({
  templateUrl: './vacation-request-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class VacationRequestDeleteDialogComponent {
  vacationRequest?: IVacationRequest;

  protected vacationRequestService = inject(VacationRequestService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.vacationRequestService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
