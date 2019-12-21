import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { VendorModel } from '../_models/vendor.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class VendorsService {
	userToken = localStorage.getItem(environment.authTokenKey);
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	// creates new contacts
	createVendor(vendor): Observable<VendorModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<VendorModel>(`${BASE_URL}/api/vendor`, vendor, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get all contacts
	getVendors(skip, limit): Observable<VendorModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<VendorModel[]>(`${BASE_URL}/api/vendor/all`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				limit: limit,
				skip: skip,
			}
		});
	}

	getVendorsCount(): Observable<VendorModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<VendorModel[]>(`${BASE_URL}/api/vendor/all?count=${1}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get a contact
	getVendorById(vendorId: string): Observable<VendorModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<VendorModel>(`${BASE_URL}/api/vendor?vendor_id=${vendorId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// update a contact
	updateVendor(vendor: any, vendorId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<VendorModel>(`${BASE_URL}/api/vendor?vendor_id=${vendorId}`, vendor, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a contact
	deleteVendor(vendorId: string): Observable<VendorModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<VendorModel>(`${BASE_URL}/api/vendor?vendor_id=${vendorId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	sendPO(order, projectId, vendorId): Observable<VendorModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<VendorModel>(`${BASE_URL}/api/sales/purchase`, order, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				project_id: projectId,
				vendor_id: vendorId
			}
		});
	}

	getPOs(vendorId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/sales/listpurchase`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				vendor_id: vendorId
			}
		});
	}
}
