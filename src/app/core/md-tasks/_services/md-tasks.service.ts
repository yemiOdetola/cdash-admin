import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { MdTaskModel } from '../_models/md-task.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class MdTasksService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// creates new md-tasks
	createMdTask(mdTask): Observable<MdTaskModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<MdTaskModel>(`${BASE_URL}/api/md`, mdTask, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get all mdTasks
	getMdTasks(skip, limit, user_id): Observable<MdTaskModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<MdTaskModel[]>(`${BASE_URL}/api/md/all`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				skip: skip,
				limit: limit,
				user_id
			}
		});
	}

	getMdTasksEvery(): Observable<MdTaskModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<MdTaskModel[]>(`${BASE_URL}/api/md/every`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getMdTasksCount(user_id): Observable<MdTaskModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<MdTaskModel[]>(`${BASE_URL}/api/md/all`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				count: '1',
				user_id
			}
		});
	}

	getMyTasks(skip, limit): Observable<MdTaskModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<MdTaskModel[]>(`${BASE_URL}/api/md/task`, {
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

	getMyTaskEvery(): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<MdTaskModel[]>(`${BASE_URL}/api/md/myevery`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// api/md/myevery

	getMyTaskById(mdTaskId: string): Observable<MdTaskModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<MdTaskModel>(`${BASE_URL}/api/md?md_id=${mdTaskId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}


	getMyTasksCount(): Observable<MdTaskModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<MdTaskModel[]>(`${BASE_URL}/api/md/task?count=${1}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get a mdTask
	getMdTaskById(mdTaskId: string): Observable<MdTaskModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<MdTaskModel>(`${BASE_URL}/api/md?md_id=${mdTaskId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// update a md
	updateMdTask(mdTask: any, mdTaskId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<MdTaskModel>(`${BASE_URL}/api/md?md_id=${mdTaskId}`, mdTask, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a md
	deleteMdTask(mdTaskId: string): Observable<MdTaskModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<MdTaskModel>(`${BASE_URL}/api/md?md_id=${mdTaskId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getUsers(): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/auth/user/myusers`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getOneUser(userId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/auth/user/one?user_id=${userId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}
}
