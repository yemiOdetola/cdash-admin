import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService } from '../../_base/crud';

// Model
import { AssetModel } from '../_models/asset.model';
import { environment } from '../../../../environments/environment';

// url
const BASE_URL = environment.BASE_URL;

@Injectable()
export class AssetsService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


	// creates new asset
	createAsset(asset): Observable<AssetModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<AssetModel>(`${BASE_URL}/api/asset`, asset, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get all assets
	getAssets(skip, limit): Observable<AssetModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<AssetModel[]>(`${BASE_URL}/api/asset/all`, {
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

	getAssetsCount(): Observable<AssetModel[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<AssetModel[]>(`${BASE_URL}/api/asset/all?count=${1}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// get a asset
	getAssetById(assetId: string): Observable<AssetModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<AssetModel>(`${BASE_URL}/api/asset?asset_id=${assetId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// update a asset
	updateAsset(asset: any, assetId: string) {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<AssetModel>(`${BASE_URL}/api/asset?asset_id=${assetId}`, asset, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}

	// delete a asset
	deleteAsset(assetId: string): Observable<AssetModel> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<AssetModel>(`${BASE_URL}/api/asset?asset_id=${assetId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
				'encrypted': 'true'
			}
		});
	}
}
