import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { LeadModel } from '../_models/lead.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class LeadsService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// getUserByToken(): Observable<User> {
	//     const userToken = localStorage.getItem(environment.authTokenKey);
	//     return this.http.get<User>(API_USERS_URL, { headers: {'Authorization': 'Bearer ' + userToken
	//   , 'encrypted': 'true'} });
	// }

	// creates new lead
	createLead(lead,): Observable<LeadModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<LeadModel>(`${BASE_URL}/api/lead`, lead, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get all leads
	getLeads(skip, limit, user_id): Observable<LeadModel[]> {
		console.log(user_id);
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<LeadModel[]>(`${BASE_URL}/api/lead/all`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				limit: limit,
				skip: skip,
				user_id: user_id
			}
		});
	}

	getLeadsCount(user_id): Observable<LeadModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<LeadModel[]>(`${BASE_URL}/api/lead/all`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				count: '1',
				user_id: user_id
			}
		});
	}

	getLeadsEvery(): Observable<LeadModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<LeadModel[]>(`${BASE_URL}/api/lead/every`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get a lead
	getLeadById(leadId: string): Observable<LeadModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<LeadModel>(`${BASE_URL}/api/lead?lead_id=${leadId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// update a lead
	updateLead(lead: any, leadId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<LeadModel>(`${BASE_URL}/api/lead?lead_id=${leadId}`, lead, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a lead
	deleteLead(leadId: string): Observable<LeadModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<LeadModel>(`${BASE_URL}/api/lead?lead_id=${leadId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	convertLead(leadId: string): Observable<LeadModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<LeadModel>(`${BASE_URL}/api/lead/contact?lead_id=${leadId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}
}
