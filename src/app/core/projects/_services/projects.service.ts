import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { ProjectModel } from '../_models/project.model';
import { ProjectUserModel } from '../_models/project-user.model';
import { ProjectVendorModel } from '../_models/project-vendor.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class ProjectsService {
	userToken = localStorage.getItem(environment.authTokenKey);
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	// creates new projects
	createProject(project): Observable<ProjectModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<ProjectModel>(`${BASE_URL}/api/project`, project, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getLogs(skip, limit): Observable<ProjectModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ProjectModel[]>(`${BASE_URL}/logs`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			},
			params: {
				count: limit,
				skip: skip
			}
		});
	}


	getLogsCount(): Observable<ProjectModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ProjectModel[]>(`${BASE_URL}/logs/count`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	// get all projects
	getProjects(skip, limit, user_id): Observable<ProjectModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ProjectModel[]>(`${BASE_URL}/api/project/all`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				limit: limit,
				skip: skip,
				user_id
			}
		});
	}
	getProjectsEvery(): Observable<ProjectModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ProjectModel[]>(`${BASE_URL}/api/project/every`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getProjectsCount(user_id): Observable<ProjectModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ProjectModel[]>(`${BASE_URL}/api/project/all`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}, params: {
				user_id,
				count: '1'
			}
		});
	}

	// get a project
	getProjectById(projectId: string): Observable<ProjectModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ProjectModel>(`${BASE_URL}/api/project?project_id=${projectId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// update a project
	updateProject(project: any, projectId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.put<any>(`${BASE_URL}/api/project?project_id=${projectId}`, project, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a project
	deleteProject(projectId: string): Observable<ProjectModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<ProjectModel>(`${BASE_URL}/api/project?project_id=${projectId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	addUserToProject(user) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<ProjectModel>(`${BASE_URL}/api/project/user`, user, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	deleteUserFromProject(user_id) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<ProjectModel>(`${BASE_URL}/api/project/user?projectuser_id=${user_id}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getProjectUsers(projectId) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ProjectModel[]>(`${BASE_URL}/api/project/user?project_id=${projectId}`, {
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

	addVendorToProject(vendor) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<ProjectModel>(`${BASE_URL}/api/project/vendor`, vendor, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	deleteVendorFromProject(vendor_id) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<ProjectModel>(`${BASE_URL}/api/project/vendor?projectvendor_id=${vendor_id}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getProjectVendors(projectId) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ProjectModel[]>(`${BASE_URL}/api/project/vendor?project_id=${projectId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getVendors(): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/api/vendor/all`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}


	addCommentToProject(comment) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<ProjectModel>(`${BASE_URL}/api/project/comment`, comment, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	deleteCommentFromProject(comment_id) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<ProjectModel>(`${BASE_URL}/api/project/comment?projectcomment_id=${comment_id}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getProjectComments(projectId) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ProjectModel[]>(`${BASE_URL}/api/project/comment?project_id=${projectId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getPOs(projectId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/sales/listpurchase`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				project_id: projectId
			}
		});
	}

}
