import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IEmployee {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  startDate?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewEmployee = Omit<IEmployee, 'id'> & { id: null };
