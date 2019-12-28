import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { UserModel } from '../_models/user.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class UserService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	createStaff(asset): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/staff`, asset, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}

	getStaffs(skip, limit): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/staff`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			},
			params: {
				count: limit,
				skip: skip
			}
		});
	}

	getStaffsCount(): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/staff/count`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}


	getStaffById(staffId: string): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/staff/${staffId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}

	updateStaff(staff: any, staffId: string): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<any>(`${BASE_URL}/staff/${staffId}`, staff, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}

	profileEdit(user: any): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<any>(`${BASE_URL}/user/edit_profile`, user, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}

	countStaffs(): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/staff/count`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}

	// delete a asset
	deleteStaff(staffId: string): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<any>(`${BASE_URL}/staff/${staffId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}

	getUsersCount(): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/user/count`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	// get a contact
	getUserById(UserId: string): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/user/${UserId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}


	// creates new contacts
	createUser(User): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/user/register`, User, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	updatePassword(User): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<any>(`${BASE_URL}/user/change_password/admin`, User, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	// get all contacts
	getUsers(skip, limit): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/user`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			},
			params: {
				count: limit,
				skip: skip,
			}
		});
	}

		// update a contact
		updateUser(User: UserModel, UserId: string) {
			const userToken = localStorage.getItem(environment.authTokenKey);
			return this.http.put<UserModel>(`${BASE_URL}/user/${UserId}`, User, {
				headers: {
					'Authorization': 'Bearer ' + userToken
				}
			});
		}

	getHODUsers(skip, limit, hodId): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/auth/user/all`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				hod: hodId,
				limit: limit,
				skip: skip,
			}
		});
	}

	getUsersBirthday(): Observable<UserModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<UserModel[]>(`${BASE_URL}/auth/user/birthdays`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	updateRoles(User: any, UserId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<UserModel>(`${BASE_URL}/auth/user/roles?user_id=${UserId}`, User, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a contact
	deleteUser(UserId: string): Observable<UserModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<UserModel>(`${BASE_URL}/auth/user?user_id=${UserId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}
	// user hod
	hodUser(UserId: string): Observable<UserModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		console.log(userToken);
		return this.http.get<UserModel>(`${BASE_URL}/auth/user/make-head?user_id=${UserId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}
	// remove hod
	removehodUser(UserId: string): Observable<UserModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<UserModel>(`${BASE_URL}/auth/user/remove-head?user_id=${UserId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// hod list
	hodList(UserId: string): Observable<UserModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<UserModel>(`${BASE_URL}/auth/user/heads?user_id=${UserId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}
	// hod lis
	assign(user_id: string,head_id: string): Observable<UserModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<UserModel>(`${BASE_URL}/auth/user/assign-hod`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},params: {
				user_id, head_id
			}
		});
	}
}
