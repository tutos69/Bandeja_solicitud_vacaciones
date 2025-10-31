import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IVacationRequest } from '../vacation-request.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../vacation-request.test-samples';

import { RestVacationRequest, VacationRequestService } from './vacation-request.service';

const requireRestSample: RestVacationRequest = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.format(DATE_FORMAT),
  endDate: sampleWithRequiredData.endDate?.format(DATE_FORMAT),
  approvedStartDate: sampleWithRequiredData.approvedStartDate?.format(DATE_FORMAT),
  approvedEndDate: sampleWithRequiredData.approvedEndDate?.format(DATE_FORMAT),
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  decidedAt: sampleWithRequiredData.decidedAt?.toJSON(),
};

describe('VacationRequest Service', () => {
  let service: VacationRequestService;
  let httpMock: HttpTestingController;
  let expectedResult: IVacationRequest | IVacationRequest[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(VacationRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a VacationRequest', () => {
      const vacationRequest = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(vacationRequest).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VacationRequest', () => {
      const vacationRequest = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(vacationRequest).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a VacationRequest', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of VacationRequest', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a VacationRequest', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVacationRequestToCollectionIfMissing', () => {
      it('should add a VacationRequest to an empty array', () => {
        const vacationRequest: IVacationRequest = sampleWithRequiredData;
        expectedResult = service.addVacationRequestToCollectionIfMissing([], vacationRequest);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vacationRequest);
      });

      it('should not add a VacationRequest to an array that contains it', () => {
        const vacationRequest: IVacationRequest = sampleWithRequiredData;
        const vacationRequestCollection: IVacationRequest[] = [
          {
            ...vacationRequest,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVacationRequestToCollectionIfMissing(vacationRequestCollection, vacationRequest);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VacationRequest to an array that doesn't contain it", () => {
        const vacationRequest: IVacationRequest = sampleWithRequiredData;
        const vacationRequestCollection: IVacationRequest[] = [sampleWithPartialData];
        expectedResult = service.addVacationRequestToCollectionIfMissing(vacationRequestCollection, vacationRequest);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vacationRequest);
      });

      it('should add only unique VacationRequest to an array', () => {
        const vacationRequestArray: IVacationRequest[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const vacationRequestCollection: IVacationRequest[] = [sampleWithRequiredData];
        expectedResult = service.addVacationRequestToCollectionIfMissing(vacationRequestCollection, ...vacationRequestArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const vacationRequest: IVacationRequest = sampleWithRequiredData;
        const vacationRequest2: IVacationRequest = sampleWithPartialData;
        expectedResult = service.addVacationRequestToCollectionIfMissing([], vacationRequest, vacationRequest2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vacationRequest);
        expect(expectedResult).toContain(vacationRequest2);
      });

      it('should accept null and undefined values', () => {
        const vacationRequest: IVacationRequest = sampleWithRequiredData;
        expectedResult = service.addVacationRequestToCollectionIfMissing([], null, vacationRequest, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vacationRequest);
      });

      it('should return initial array if no VacationRequest is added', () => {
        const vacationRequestCollection: IVacationRequest[] = [sampleWithRequiredData];
        expectedResult = service.addVacationRequestToCollectionIfMissing(vacationRequestCollection, undefined, null);
        expect(expectedResult).toEqual(vacationRequestCollection);
      });
    });

    describe('compareVacationRequest', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVacationRequest(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 10483 };
        const entity2 = null;

        const compareResult1 = service.compareVacationRequest(entity1, entity2);
        const compareResult2 = service.compareVacationRequest(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 10483 };
        const entity2 = { id: 12195 };

        const compareResult1 = service.compareVacationRequest(entity1, entity2);
        const compareResult2 = service.compareVacationRequest(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 10483 };
        const entity2 = { id: 10483 };

        const compareResult1 = service.compareVacationRequest(entity1, entity2);
        const compareResult2 = service.compareVacationRequest(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
