import dayjs from 'dayjs/esm';

import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: 8899,
  firstName: 'Patricia',
  lastName: 'Espinosa Urrutia',
  startDate: dayjs('2025-10-31'),
};

export const sampleWithPartialData: IEmployee = {
  id: 15019,
  firstName: 'Blanca',
  lastName: 'Madrigal Durán',
  startDate: dayjs('2025-10-31'),
};

export const sampleWithFullData: IEmployee = {
  id: 19019,
  firstName: 'Patricio',
  lastName: 'Reyna Naranjo',
  startDate: dayjs('2025-10-31'),
};

export const sampleWithNewData: NewEmployee = {
  firstName: 'Mariana',
  lastName: 'Bonilla Jaimes',
  startDate: dayjs('2025-10-30'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
