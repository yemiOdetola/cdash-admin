import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { OrganizationModel } from '../_models/organization.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class OrganizationsService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	// creates new organization
	createOrganization(organization): Observable<OrganizationModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<OrganizationModel>(`${BASE_URL}/organization`, organization, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	addTurnovers(turnover): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/organization/turnover`, turnover, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	// get all organizations
	getOrganizations(skip, limit): Observable<OrganizationModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<OrganizationModel[]>(`${BASE_URL}/api/organization/all`, {
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

	getOrganizationsEvery(): Observable<OrganizationModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<OrganizationModel[]>(`${BASE_URL}/api/organization/every`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getOrganizationsCount(): Observable<OrganizationModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<OrganizationModel[]>(`${BASE_URL}/api/organization/all`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				count: '1',
			}
		});
	}

	// get a organization
	getOrganization(): Observable<OrganizationModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<OrganizationModel>(`${BASE_URL}/organization`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	// update a organization
	updateOrganization(organization) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<OrganizationModel>(`${BASE_URL}/organization`, organization, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	// delete a organization
	deleteOrganization(organizationId: string): Observable<OrganizationModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<OrganizationModel>(`${BASE_URL}/api/organization?organization_id=${organizationId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}
}
