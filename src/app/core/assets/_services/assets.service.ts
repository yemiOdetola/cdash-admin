import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class AssetsService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	// creates new asset
	createAsset(asset): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/asset`, asset, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}


	// get all assets
	getAssets(skip, limit): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/asset`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			},
			params: {
				count: limit,
				skip: skip
			}
		});
	}

	getAssetContainerById(containerId: string): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/asset/${containerId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	getAssetsData(skip, limit): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/asset_data`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			},
			params: {
				count: limit,
				skip: skip
			}
		});
	}

	getAssetsCount(): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/asset/count`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	// get a asset
	getAssetById(assetId: string): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/asset/${assetId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// update a asset
	updateAsset(asset: any, assetId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<any>(`${BASE_URL}/api/asset?asset_id=${assetId}`, asset, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a asset
	deleteAsset(assetId: string): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<any>(`${BASE_URL}/api/asset?asset_id=${assetId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}
}
