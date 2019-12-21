import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { RoleModel } from '../_models/role.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class RolesService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	// creates new role
	createRole(role): Observable<RoleModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<RoleModel>(`${BASE_URL}/api/role`, role, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get all roles
	getRoles(skip, limit): Observable<RoleModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<RoleModel[]>(`${BASE_URL}/api/role/all`, {
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
  // get every roless
  getEveryRoles(): Observable<RoleModel[]> {
	const userToken = localStorage.getItem(environment.authTokenKey);
	return this.http.get<RoleModel[]>(`${BASE_URL}/api/role/every`, {
		headers: {
			'Authorization': 'Bearer ' + userToken,
			'encrypted': 'true'
		},
	});
}
	getRolesCount(): Observable<RoleModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<RoleModel[]>(`${BASE_URL}/api/role/all?count=${1}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get a role
	getRoleById(roleId: string): Observable<RoleModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<RoleModel>(`${BASE_URL}/api/role?role_id=${roleId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// update a role
	updateRole(role: RoleModel, roleId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<RoleModel>(`${BASE_URL}/api/role?role_id=${roleId}`, role, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a role
	deleteRole(roleId: string): Observable<RoleModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<RoleModel>(`${BASE_URL}/api/role?role_id=${roleId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}
}
