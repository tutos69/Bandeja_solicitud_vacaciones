import dayjs from 'dayjs/esm';
import { IEmployee } from 'app/entities/employee/employee.model';
import { IUser } from 'app/entities/user/user.model';
import { VacationStatus } from 'app/entities/enumerations/vacation-status.model';

export interface IVacationRequest {
  id: number;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  requestedDays?: number | null;
  status?: keyof typeof VacationStatus | null;
  approverComment?: string | null;
  approvedStartDate?: dayjs.Dayjs | null;
  approvedEndDate?: dayjs.Dayjs | null;
  approvedDays?: number | null;
  createdAt?: dayjs.Dayjs | null;
  decidedAt?: dayjs.Dayjs | null;
  employee?: Pick<IEmployee, 'id'> | null;
  approver?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewVacationRequest = Omit<IVacationRequest, 'id'> & { id: null };
