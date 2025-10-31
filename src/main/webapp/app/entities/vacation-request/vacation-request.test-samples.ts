import dayjs from 'dayjs/esm';

import { IVacationRequest, NewVacationRequest } from './vacation-request.model';

export const sampleWithRequiredData: IVacationRequest = {
  id: 17402,
  startDate: dayjs('2025-10-30'),
  endDate: dayjs('2025-10-30'),
  requestedDays: 8275,
  status: 'PENDING',
  createdAt: dayjs('2025-10-30T23:55'),
};

export const sampleWithPartialData: IVacationRequest = {
  id: 12959,
  startDate: dayjs('2025-10-31'),
  endDate: dayjs('2025-10-31'),
  requestedDays: 30497,
  status: 'REJECTED',
  approverComment: 'mainstream aha',
  approvedStartDate: dayjs('2025-10-30'),
  approvedEndDate: dayjs('2025-10-31'),
  approvedDays: 19104,
  createdAt: dayjs('2025-10-31T12:55'),
  decidedAt: dayjs('2025-10-30T18:02'),
};

export const sampleWithFullData: IVacationRequest = {
  id: 29441,
  startDate: dayjs('2025-10-30'),
  endDate: dayjs('2025-10-31'),
  requestedDays: 10620,
  status: 'PENDING',
  approverComment: 'when deliquesce',
  approvedStartDate: dayjs('2025-10-31'),
  approvedEndDate: dayjs('2025-10-31'),
  approvedDays: 4685,
  createdAt: dayjs('2025-10-31T04:58'),
  decidedAt: dayjs('2025-10-31T01:32'),
};

export const sampleWithNewData: NewVacationRequest = {
  startDate: dayjs('2025-10-31'),
  endDate: dayjs('2025-10-30'),
  requestedDays: 31910,
  status: 'APPROVED',
  createdAt: dayjs('2025-10-30T20:49'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
