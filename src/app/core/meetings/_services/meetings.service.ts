import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { MeetingModel } from '../_models/meeting.model';
import { MeetingUserModel } from '../_models/meeting-user.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class MeetingsService {
	userToken = localStorage.getItem(environment.authTokenKey);
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	// creates new meetings
	createMeeting(meeting): Observable<MeetingModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<MeetingModel>(`${BASE_URL}/api/meeting`, meeting, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get all meetings
	getMeetings(skip, limit, user_id): Observable<MeetingModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<MeetingModel[]>(`${BASE_URL}/api/meeting/all`, {
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

	getMeetingsCount(user_id): Observable<MeetingModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<MeetingModel[]>(`${BASE_URL}/api/meeting/all`, {
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

	// get a meeting
	getMeetingById(meetingId: string): Observable<MeetingModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<MeetingModel>(`${BASE_URL}/api/meeting?meeting_id=${meetingId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// update a meeting
	updateMeeting(meeting: any, meetingId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<any>(`${BASE_URL}/api/meeting?meeting_id=${meetingId}`, meeting, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a meeting
	deleteMeeting(meetingId: string): Observable<MeetingModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<MeetingModel>(`${BASE_URL}/api/meeting?meeting_id=${meetingId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	addUserToMeeting(user) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<MeetingModel>(`${BASE_URL}/api/meeting/user`, user, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	deleteUserFromMeeting(user_id) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<MeetingModel>(`${BASE_URL}/api/meeting/user?meetinguser_id=${user_id}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getMeetingUsers(meetingId) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<MeetingModel[]>(`${BASE_URL}/api/meeting/user?meeting_id=${meetingId}`, {
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

}
