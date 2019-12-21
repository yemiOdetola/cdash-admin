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

	// creates new contacts
	createUser(User): Observable<UserModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		if (User.dob) {
			User.dob = User.dob.getTime();
		}
		return this.http.post<UserModel>(`${BASE_URL}/auth/user/signup`, User, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get all contacts
	getUsers(skip, limit): Observable<UserModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<UserModel[]>(`${BASE_URL}/auth/user/all`, {
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

	getHODUsers(skip, limit, hodId): Observable<UserModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<UserModel[]>(`${BASE_URL}/auth/user/all`, {
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

	// auth/user/birthdays

	getUsersCount(): Observable<UserModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<UserModel[]>(`${BASE_URL}/auth/user/all?count=${1}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get a contact
	getUserById(UserId: string): Observable<UserModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<UserModel>(`${BASE_URL}/auth/user/id?user_id=${UserId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// update a contact
	updateUser(User: UserModel, UserId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<UserModel>(`${BASE_URL}/auth/user?user_id=${UserId}`, User, {
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
