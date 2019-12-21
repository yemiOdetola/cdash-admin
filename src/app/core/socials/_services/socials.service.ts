import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { SocialModel } from '../_models/social.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class SocialsService {
	userToken = localStorage.getItem(environment.authTokenKey);
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	// creates new contacts
	createLink(social): Observable<SocialModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<SocialModel>(`${BASE_URL}/api/link`, social, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get all contacts
	getLinks(skip, limit): Observable<SocialModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<SocialModel[]>(`${BASE_URL}/api/link/all`, {
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
	getLinksCount(): Observable<SocialModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<SocialModel[]>(`${BASE_URL}/api/link/all?count=${1}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get a contact
	getLinkById(code: string): Observable<SocialModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<SocialModel>(`${BASE_URL}/api/link?code=${code}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getEachSocialAnalytics(code: string, type: string): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/link/analytics?code=${code}&type=${type}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getAllSocialAnalytics(code: string): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/link/analytics?code=${code}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// update a contact
	updateLink(link: any, code: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<SocialModel>(`${BASE_URL}/api/link?code=${code}`, link, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a contact
	deleteLink(code: string): Observable<SocialModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<SocialModel>(`${BASE_URL}/api/link?code=${code}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}
}
