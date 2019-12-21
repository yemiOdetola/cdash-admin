import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { ContactModel } from '../_models/contact.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class ContactsService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	// creates new contacts
	createContact(contact): Observable<ContactModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<ContactModel>(`${BASE_URL}/api/lead`, contact, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get all contacts
	getContacts(skip, limit, user_id): Observable<ContactModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ContactModel[]>(`${BASE_URL}/api/lead/contact/all`, {
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

	getContactsCount(user_id): Observable<ContactModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ContactModel[]>(`${BASE_URL}/api/lead/contact/all`, {
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

	// get a contact
	getContactById(contactId: string): Observable<ContactModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ContactModel>(`${BASE_URL}/api/lead?lead_id=${contactId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// update a contact
	updateContact(contact: any, contactId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.put<ContactModel>(`${BASE_URL}/api/lead?lead_id=${contactId}`, contact, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a contact
	deleteContact(contactId: string): Observable<ContactModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<ContactModel>(`${BASE_URL}/api/lead?lead_id=${contactId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getMOUs(contactId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/sales/listmou`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				contact_id: contactId,
				// contact_id: contactId
			}
		});
	}

	getInvoices(contactId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/sales/listinvoice`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				contact_id: contactId
			}
		});
	}

	getQuotation(contactId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/sales/listquotation`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				contact_id: contactId
			}
		});
	}
}
