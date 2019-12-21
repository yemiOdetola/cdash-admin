import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { ClaimModel } from '../_models/claim.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class ClaimsService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	// creates new claim
	createClaim(payload): Observable<ClaimModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<ClaimModel>(`${BASE_URL}/api/hr`, payload, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	createLeave(leave): Observable<ClaimModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<ClaimModel>(`${BASE_URL}/api/hr`, leave, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	createLoan(loan): Observable<ClaimModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<ClaimModel>(`${BASE_URL}/api/hr`, loan, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	updateRequest(request: ClaimModel, claimId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<ClaimModel>(`${BASE_URL}/api/hr?hr_id=${claimId}`, request, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getClaimById(claimId: string): Observable<ClaimModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ClaimModel>(`${BASE_URL}/api/hr`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				hr_id: claimId
			}
		});
	}

	deleteRequest(claimId: string): Observable<ClaimModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<ClaimModel>(`${BASE_URL}/api/hr?hr_id=${claimId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getClaimTypes(): Observable<ClaimModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ClaimModel[]>(`${BASE_URL}/api/claim/every`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
		});
	}
	// get all claims
	getAllClaimTypes(skip, limit, ): Observable<ClaimModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ClaimModel[]>(`${BASE_URL}/api/claim/all`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				limit: limit,
				skip: skip
			}
		});
	}
	// creates new claim
	createClaimType(payload): Observable<ClaimModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<ClaimModel>(`${BASE_URL}/api/claim`, payload, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getClaimsTypeCount(): Observable<ClaimModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/claim/all`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				count: '1',
			}
		});
	}

	// delete a claim /v1/api/hr/item
	deleteTypeRequest(claimId: string): Observable<ClaimModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<ClaimModel>(`${BASE_URL}/api/claim?claim_id=${claimId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getClaimType(claimId: string): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/claim?claim_id=${claimId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get all claims
	getClaims(skip, limit, type, user_id): Observable<ClaimModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ClaimModel[]>(`${BASE_URL}/api/hr/all`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				type: type,
				limit: limit,
				skip: skip,
				user_id: user_id
			}
		});
	}

	getClaimsCount(count, type, user_id): Observable<ClaimModel[]> {
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

	getLoansCount(count, type): Observable<ClaimModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/claim/all`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				count: count,
				type: type
			}
		});
	}

	addNewClaimItem(payload, claimId) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/api/hr/item`, payload, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				hr_id: claimId
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

	getAllClaimItems(claimId) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/api/hr/claimitems?h=${claimId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	approveSingleHR(claimId) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/api/hr/approve`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				hr_id: claimId
			}
		});
	}

	getApprovalList(type, user_id): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/api/hr/approvals`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				type: type,
				user_id: user_id
			}
		});
	}

	getApprovalListAll(user_id): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/api/hr/approvals`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getApprovedList(skip, limit, type, user_id): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/api/hr/approved`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				type: type,
				limit: limit,
				skip: skip,
				user_id: user_id
			}
		});
	}

	getApprovalSummary(type, user_id): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/api/hr/summary`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				type: type,
				user_id: user_id
			}
		});
	}

	getApprovalItemSummary(type, user_id): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/api/hr/summary`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				type: type,
				user_id: user_id,
				itemonly: 'true'
			}
		});
	}

	approveApproval(type, claimIdsArray): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<ClaimModel>(`${BASE_URL}/api/hr/finalapprove`, claimIdsArray, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				type: type
			}
		});
	}


	approvedListCount(count, type): Observable<ClaimModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/hr/approved`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				count: count,
				type: type
			}
		});
	}
}
