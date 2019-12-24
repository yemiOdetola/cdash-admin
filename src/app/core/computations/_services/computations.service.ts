import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class ComputationsService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	updateScore(score, scoreId) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<any>(`${BASE_URL}/maturity/${scoreId}`, score, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}

	// creates new claim
	createScore(score): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/maturity`, score, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	// creates new claim
	createClaim(payload): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/api/hr`, payload, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	updateRequest(request: any, claimId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<any>(`${BASE_URL}/api/hr?hr_id=${claimId}`, request, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getMaturityList(skip, limit): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/maturity`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			},
			params: {
				count: limit,
				skip: skip
			}
		});
	}

	countMaturityList(): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/maturity/count`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	getScoreById(scoreId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/maturity/${scoreId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}

	getScoreAverage(): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/maturity/average`, {}, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}

	deleteScore(scoreId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<any>(`${BASE_URL}/maturity/${scoreId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}


	getClaimById(claimId: string): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/hr`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				hr_id: claimId
			}
		});
	}

	deleteRequest(claimId: string): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<any>(`${BASE_URL}/api/hr?hr_id=${claimId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getClaimsCount(count, type, user_id): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/hr/all`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				count: count,
				type: type,
				user_id: user_id
			}
		});
	}

	deleteItemFromClaim(itemId) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<any>(`${BASE_URL}/api/hr/item?claim_item_id=${itemId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}
}
