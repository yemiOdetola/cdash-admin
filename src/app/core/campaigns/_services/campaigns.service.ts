import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { CampaignModel } from '../_models/campaign.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class CampaignsService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	// creates new campaign
	createCampaign(asset): Observable<CampaignModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<CampaignModel>(`${BASE_URL}/api/campaign`, asset, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get all campaigns
	getCampaigns(skip, limit, user_id): Observable<CampaignModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<CampaignModel[]>(`${BASE_URL}/api/campaign/all`, {
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

	getCampaignsEvery(): Observable<CampaignModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<CampaignModel[]>(`${BASE_URL}/api/campaign/every`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
		});
	}

	getCampaignsCount(user_id): Observable<CampaignModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<CampaignModel[]>(`${BASE_URL}/api/campaign/all`, {
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

	// get a campaign
	getCampaignById(campaignId: string): Observable<CampaignModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<CampaignModel>(`${BASE_URL}/api/campaign?campaign_id=${campaignId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// update a campaign
	updateCampaign(campaign: CampaignModel, campaignId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<CampaignModel>(`${BASE_URL}/api/campaign?campaign_id=${campaignId}`, campaign, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a campaign
	deleteCampaign(campaignId: string): Observable<CampaignModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<CampaignModel>(`${BASE_URL}/api/campaign?campaign_id=${campaignId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	getContactsEvery(): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/api/lead/contact/every`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}
}
