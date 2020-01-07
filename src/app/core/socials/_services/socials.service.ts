import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class SocialsService {
	userToken = localStorage.getItem(environment.authTokenKey);
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	// creates new contacts
	createLink(social): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/api/link`, social, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	addSocial(social): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/social/social-setup`, social, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	addNewSocial(social): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/social/social`, social, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	getSocial(url): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/social/twitter?url=${url}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	deleteAccount(id): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<any>(`${BASE_URL}/social/${id}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}


	getSingleSocial(id): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/social/${id}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	getAllSocials(): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/social`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	getSocialSetup(): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/social/social-setup`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}


	// get all contacts
	getLinks(skip, limit): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/api/link/all`, {
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
	getLinksCount(): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/api/link/all?count=${1}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get a contact
	getLinkById(code: string): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/link?code=${code}`, {
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
		return this.http.put<any>(`${BASE_URL}/api/link?code=${code}`, link, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a contact
	deleteLink(code: string): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<any>(`${BASE_URL}/api/link?code=${code}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}
}
