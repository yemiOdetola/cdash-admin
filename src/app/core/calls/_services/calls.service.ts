import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { CallLogModel } from '../_models/call.model';
import { DeviceModel } from '../_models/device.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class CallsService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// get all Call logs
	getCallLogs(skip, limit): Observable<CallLogModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<CallLogModel[]>(`${BASE_URL}/api/log/all`, {
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

	getCallLogsCount(): Observable<CallLogModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<CallLogModel[]>(`${BASE_URL}/api/log/all?count=${1}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get a Call logs
	getCallLogById(callLogId: string): Observable<CallLogModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<CallLogModel>(`${BASE_URL}/api/log?log_id=${callLogId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// update a Call logs
	updateCallLog(callLog: CallLogModel, callLogId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<CallLogModel>(`${BASE_URL}/api/log?log_id=${callLogId}`, callLog, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// Conver Call log to lead
	convertLogToLead(convertCallData, logId: string): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/api/log/to_lead?log_id=${logId}`, convertCallData, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// Conver Call log to contact
	convertLogToContact(ConvertCallData, callLogId: string): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/api/log/to_contact?log_id=${callLogId}`, ConvertCallData, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a call log
	deleteCallLog(callLogId: string): Observable<CallLogModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<CallLogModel>(`${BASE_URL}/api/log?log_id=${callLogId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}


	// DEVICES DEVICES DEVICES DEVICES DEVICES DEVICES DEVICES DEVICES

	getAllDevices(skip, limit): Observable<DeviceModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<DeviceModel[]>(`${BASE_URL}/api/device/all`, {
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

	getAllDevicesCount(): Observable<DeviceModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<DeviceModel[]>(`${BASE_URL}/api/device/all?count=${1}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get a Call logs
	getDeviceById(deviceId: string): Observable<DeviceModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<DeviceModel>(`${BASE_URL}/api/device?device_id=${deviceId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// update a Call logs
	updateDevice(device: DeviceModel, deviceId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<DeviceModel>(`${BASE_URL}/api/device?device_id=${deviceId}`, device, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a call log
	deleteDevice(deviceId: string): Observable<DeviceModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<DeviceModel>(`${BASE_URL}/api/device?device_id=${deviceId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}


	// UNUSUAL UNUSUAL UNUSUAL UNUSUAL UNUSUAL UNUSUAL /v1/api/type/every

	getCampaignTypes(): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/type/every`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

}
