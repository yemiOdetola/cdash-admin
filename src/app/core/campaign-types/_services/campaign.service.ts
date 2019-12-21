import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { CampaignTypeModel } from '../_models/campaign.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class CampaignsService {
	constructor( private http: HttpClient, private httpUtils: HttpUtilsService ) {}

	// creates new campaign
	createCampaignType(campaignType): Observable<CampaignTypeModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<CampaignTypeModel>(`${BASE_URL}/api/type`, campaignType, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getCampaignTypes(skip, limit): Observable<CampaignTypeModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<CampaignTypeModel[]>(`${BASE_URL}/api/type/all`, {
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

	getCampaignTypesCount(): Observable<CampaignTypeModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<CampaignTypeModel[]>(`${BASE_URL}/api/type/all?count=${1}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getCampaignTypeById(campaignTypeId: string): Observable<CampaignTypeModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<CampaignTypeModel>(`${BASE_URL}/api/type?type_id=${campaignTypeId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	updateCampaignType(campaignType: CampaignTypeModel, campaignTypeId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.put<CampaignTypeModel>(`${BASE_URL}/api/type?type_id=${campaignTypeId}`, campaignType, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a lead
	deleteCampaignType(campaignTypeId: string): Observable<CampaignTypeModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<CampaignTypeModel>(`${BASE_URL}/api/type?type_id=${campaignTypeId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}


}
