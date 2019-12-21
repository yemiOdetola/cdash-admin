import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import * as firebase from 'firebase';
import { mergeMapTo } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class MessagingService {
	permittedToken = '';
	permissionGranted = false;
	currentMessage = new BehaviorSubject(null);

	constructor(
		private http: HttpClient,
		private angularFireDB: AngularFireDatabase,
		private angularFireAuth: AngularFireAuth,
		private angularFireMessaging: AngularFireMessaging) {
		this.angularFireMessaging.messaging.subscribe(
			(_messaging) => {
				_messaging.onMessage = _messaging.onMessage.bind(_messaging);
				_messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
			}
		);
	}

	/**
	 * update token in firebase database
	 *
	 * @param userId userId as a key
	 * @param token token as a value
	 */
	updateToken(userId, token) {
		// we can change this function to request our backend service
		this.angularFireAuth.authState.pipe(take(1)).subscribe(
			() => {
				const data = {};
				data[userId] = token;
				this.angularFireDB.object('fcmTokens/').update(data);
			});
	}

	/**
	 * request permission for notification from firebase cloud messaging
	 *
	 * @param userId userId
	 */
	updatePushId(payload, userId) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<any>(`${BASE_URL}/auth/user?user_id=${userId}`, payload, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	requestPermission(userId) {
		this.angularFireMessaging.requestToken.subscribe(
			(token) => {
				console.log(token);
				this.permittedToken = token;
				localStorage.setItem('pushToken', token);
				this.updateToken(userId, token);
				this.permissionGranted = true;
			},
			(err) => {
				this.permissionGranted = false;
				console.error('Unable to get permission to notify.', err);
			}
		);
	}

	/**
	 * hook method when new notification received in foreground
	 */
	receiveMessage() {
		this.angularFireMessaging.messages.subscribe(
			(payload) => {
				console.log('new message received.', payload);
				this.currentMessage.next(payload);
			});
	}

	getNotificationsCount(): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/notification/all?count=${1}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getNotifications(skip, limit): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/notification/all`, {
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

	viewNotification(notificationId): Observable<any>  {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<any>(`${BASE_URL}/api/notification?notification_id=${notificationId}`, {}, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
		});
	}
}
