import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { SaleModel } from '../_models/sale.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class SalesService {
	userToken = localStorage.getItem(environment.authTokenKey);
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	// creates new sale
	createSale(sale): Observable<SaleModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<SaleModel>(`${BASE_URL}/api/sales`, sale, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get all sales
	getSales(skip, limit): Observable<SaleModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<SaleModel[]>(`${BASE_URL}/api/sales/all`, {
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

	getContacts(): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/api/lead/contact/all`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getSalesCount(): Observable<SaleModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<SaleModel[]>(`${BASE_URL}/api/sales/all?count=${1}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get a sale
	getSaleById(saleId: string): Observable<SaleModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<SaleModel>(`${BASE_URL}/api/sales?sales_id=${saleId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	sendInvoice(payload, saleId: string, contactId): Observable<SaleModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<SaleModel>(`${BASE_URL}/api/sales/invoice`, payload,  {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				contact_id: contactId,
				sales_id: saleId
			}
		});
	}

	downloadInvoice(saleId: string, contactId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/sales/invoice`,  {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			responseType: 'blob' as 'json',
			params: {
				sales_id: saleId,
				contact_id: contactId,
			}
		});
	}

	sendQuotation(payload, saleId: string, contactId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/api/sales/quotation`, payload, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				sales_id: saleId,
				contact_id: contactId,
			}
		});
	}

	sendReceipt(payload, saleId: string, contactId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/api/sales/receipt`, payload, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				sales_id: saleId,
				contact_id: contactId,
			}
		});
	}

	// update a sale
	updateSale(sale: any, saleId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<any>(`${BASE_URL}/api/sales?sales_id=${saleId}`, sale, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a sale
	deleteSale(saleId: string): Observable<SaleModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<SaleModel>(`${BASE_URL}/api/sales?sale_id=${saleId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}


	sendMOU(message, saleId): Observable<SaleModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<SaleModel>(`${BASE_URL}/api/sales/mou`, message, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				sales_id: saleId
			}
		});
	}

	getMOUs(saleId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/sales/listmou`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				sales_id: saleId,
				// contact_id: contactId
			}
		});
	}

	getInvoices(saleId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/sales/listinvoice`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				sales_id: saleId
			}
		});
	}

	getReceipt(saleId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/sales/listreceipt`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				sales_id: saleId
			}
		});
	}

	getQuotation(saleId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/sales/listquotation`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				sales_id: saleId
			}
		});
	}

	getTotalExpense(): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/hr/expense`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
		});
	}
}
