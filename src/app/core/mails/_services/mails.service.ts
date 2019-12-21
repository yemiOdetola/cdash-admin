import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { MailModel } from '../_models/mail.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class MailsService {
	userToken = localStorage.getItem(environment.authTokenKey);
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	// creates new mail
	createMail(mail): Observable<MailModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<MailModel>(`${BASE_URL}/api/mail`, mail, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get all mails
	getMails(skip, limit): Observable<MailModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<MailModel[]>(`${BASE_URL}/api/mail/all`, {
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
	getAuth(): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/api/mail/auth` , {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true',
			},
		});
	}
	getisLogged(): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/mail/loginstatus` , {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true',
			},
		});
	}
	logout(): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/mail/logout` , {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true',
			},
		});
	}
	completeAuth(subId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/mail/complete?subId=` + subId , {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true',
			},
		});
	}
	getContacts(): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/api/lead/contact/all`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getMailsCount(): Observable<MailModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<MailModel[]>(`${BASE_URL}/api/mail/all?count=${1}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get a mail
	getMailById(mailId: string): Observable<MailModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<MailModel>(`${BASE_URL}/api/mails?mail_id=${mailId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	sendInvoice(mailId: string): Observable<MailModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<MailModel>(`${BASE_URL}/api/mails/invoice?mails_id=${mailId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}
	sendQuotation(mailId: string): Observable<MailModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<MailModel>(`${BASE_URL}/api/mails/quotation?mails_id=${mailId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}
	sendReceipt(mailId: string): Observable<MailModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<MailModel>(`${BASE_URL}/api/mails/receipt?mails_id=${mailId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// update a mail
	updateMail(mail: any, mailId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<any>(`${BASE_URL}/api/mails?mails_id=${mailId}`, mail, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a mail
	deleteMail(mailId: string): Observable<MailModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<MailModel>(`${BASE_URL}/api/mails?mail_id=${mailId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}
}
