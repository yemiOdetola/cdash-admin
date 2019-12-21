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
export class UploadService {
	userToken = localStorage.getItem(environment.authTokenKey);
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// /v1/api/lead/csv
	// creates new contacts
	uploadLeads(payload): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/api/lead/csv`, payload, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	uploadContacts(payload): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/api/lead/contact/csv`, payload, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

}
