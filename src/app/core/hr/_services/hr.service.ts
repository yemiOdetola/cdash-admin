import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { HrModel } from '../_models/hr.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class HrService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	getTotalExpense(): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/hr/expense`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
		});
	}

	getTotalSales(): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/sales/sum`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
		});
	}

	getQueriedSales(month, year): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/sales/sum_monthly`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				month: month,
				year: year
			}
		});
	}

	getQueriedExpenses(month, year): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/hr/expense_monthly`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				month: month,
				year: year
			}
		});
	}
	getYearQueriedIncome(year): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/sales/sum_monthly`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				year: year
			}
		});
	}

	getYearQueriedExpenses(year): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/hr/expense_monthly`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				year: year
			}
		});
	}
}
