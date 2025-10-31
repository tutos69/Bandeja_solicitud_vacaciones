import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVacationRequest, NewVacationRequest } from '../vacation-request.model';

export type PartialUpdateVacationRequest = Partial<IVacationRequest> & Pick<IVacationRequest, 'id'>;

type RestOf<T extends IVacationRequest | NewVacationRequest> = Omit<
  T,
  'startDate' | 'endDate' | 'approvedStartDate' | 'approvedEndDate' | 'createdAt' | 'decidedAt'
> & {
  startDate?: string | null;
  endDate?: string | null;
  approvedStartDate?: string | null;
  approvedEndDate?: string | null;
  createdAt?: string | null;
  decidedAt?: string | null;
};

export type RestVacationRequest = RestOf<IVacationRequest>;

export type NewRestVacationRequest = RestOf<NewVacationRequest>;

export type PartialUpdateRestVacationRequest = RestOf<PartialUpdateVacationRequest>;

export type EntityResponseType = HttpResponse<IVacationRequest>;
export type EntityArrayResponseType = HttpResponse<IVacationRequest[]>;

@Injectable({ providedIn: 'root' })
export class VacationRequestService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vacation-requests');

  create(vacationRequest: NewVacationRequest): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacationRequest);
    return this.http
      .post<RestVacationRequest>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(vacationRequest: IVacationRequest): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacationRequest);
    return this.http
      .put<RestVacationRequest>(`${this.resourceUrl}/${this.getVacationRequestIdentifier(vacationRequest)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(vacationRequest: PartialUpdateVacationRequest): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacationRequest);
    return this.http
      .patch<RestVacationRequest>(`${this.resourceUrl}/${this.getVacationRequestIdentifier(vacationRequest)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVacationRequest>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVacationRequest[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVacationRequestIdentifier(vacationRequest: Pick<IVacationRequest, 'id'>): number {
    return vacationRequest.id;
  }

  compareVacationRequest(o1: Pick<IVacationRequest, 'id'> | null, o2: Pick<IVacationRequest, 'id'> | null): boolean {
    return o1 && o2 ? this.getVacationRequestIdentifier(o1) === this.getVacationRequestIdentifier(o2) : o1 === o2;
  }

  addVacationRequestToCollectionIfMissing<Type extends Pick<IVacationRequest, 'id'>>(
    vacationRequestCollection: Type[],
    ...vacationRequestsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const vacationRequests: Type[] = vacationRequestsToCheck.filter(isPresent);
    if (vacationRequests.length > 0) {
      const vacationRequestCollectionIdentifiers = vacationRequestCollection.map(vacationRequestItem =>
        this.getVacationRequestIdentifier(vacationRequestItem),
      );
      const vacationRequestsToAdd = vacationRequests.filter(vacationRequestItem => {
        const vacationRequestIdentifier = this.getVacationRequestIdentifier(vacationRequestItem);
        if (vacationRequestCollectionIdentifiers.includes(vacationRequestIdentifier)) {
          return false;
        }
        vacationRequestCollectionIdentifiers.push(vacationRequestIdentifier);
        return true;
      });
      return [...vacationRequestsToAdd, ...vacationRequestCollection];
    }
    return vacationRequestCollection;
  }

  protected convertDateFromClient<T extends IVacationRequest | NewVacationRequest | PartialUpdateVacationRequest>(
    vacationRequest: T,
  ): RestOf<T> {
    return {
      ...vacationRequest,
      startDate: vacationRequest.startDate?.format(DATE_FORMAT) ?? null,
      endDate: vacationRequest.endDate?.format(DATE_FORMAT) ?? null,
      approvedStartDate: vacationRequest.approvedStartDate?.format(DATE_FORMAT) ?? null,
      approvedEndDate: vacationRequest.approvedEndDate?.format(DATE_FORMAT) ?? null,
      createdAt: vacationRequest.createdAt?.toJSON() ?? null,
      decidedAt: vacationRequest.decidedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restVacationRequest: RestVacationRequest): IVacationRequest {
    return {
      ...restVacationRequest,
      startDate: restVacationRequest.startDate ? dayjs(restVacationRequest.startDate) : undefined,
      endDate: restVacationRequest.endDate ? dayjs(restVacationRequest.endDate) : undefined,
      approvedStartDate: restVacationRequest.approvedStartDate ? dayjs(restVacationRequest.approvedStartDate) : undefined,
      approvedEndDate: restVacationRequest.approvedEndDate ? dayjs(restVacationRequest.approvedEndDate) : undefined,
      createdAt: restVacationRequest.createdAt ? dayjs(restVacationRequest.createdAt) : undefined,
      decidedAt: restVacationRequest.decidedAt ? dayjs(restVacationRequest.decidedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVacationRequest>): HttpResponse<IVacationRequest> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVacationRequest[]>): HttpResponse<IVacationRequest[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
