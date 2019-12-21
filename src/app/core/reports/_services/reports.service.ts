import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { ReportModel } from '../_models/report.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class ReportsService {
	userToken = localStorage.getItem(environment.authTokenKey);
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	// creates new reports
	createReport(report): Observable<ReportModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<ReportModel>(`${BASE_URL}/api/report`, report, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get all reports
	getReports(skip, limit): Observable<ReportModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ReportModel[]>(`${BASE_URL}/api/report/all`, {
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

	getReportsCount(): Observable<ReportModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ReportModel[]>(`${BASE_URL}/api/report/all?count=${1}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get a report
	getReportById(reportId: string): Observable<ReportModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<ReportModel>(`${BASE_URL}/api/report?report_id=${reportId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// update a report
	updateReport(report: ReportModel, reportId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.put<ReportModel>(`${BASE_URL}/api/report?report_id=${reportId}`, report, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a report
	deleteReport(reportId: string): Observable<ReportModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<ReportModel>(`${BASE_URL}/api/report?report_id=${reportId}`, {
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

	getReportAnalytics(payload, skip, limit): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any[]>(`${BASE_URL}/api/report/analytics`, payload, {
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

	getReportGroupAnalytics(skip, limit): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any[]>(`${BASE_URL}/api/report/dayanalytics`, {}, {
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

	getReportGroupAnalyticsCount(): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any[]>(`${BASE_URL}/api/report/dayanalytics?count=${1}`, {}, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

}
