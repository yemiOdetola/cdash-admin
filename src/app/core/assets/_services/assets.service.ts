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

	editAssetContainer(container, containerId): Observable <any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<any>(`${BASE_URL}/asset/${containerId}`, container, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}

	getAllAssetsCount(assetData): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/asset_data/count`, assetData, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}

	getAllAssetsCapital(assetData): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/asset_data/count/capital`, assetData, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}

	getAllAssetsTurnover(assetData): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/asset_data/count/turnover`, assetData, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}


	getAssetsReccurentExp(assetData): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/asset_data/count/recurring`, assetData, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}

	getAssetsCapitalExp(assetData): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/asset_data/count/capital`, assetData, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}

	createAssetData(asset): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.post<any>(`${BASE_URL}/asset_data`, asset, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}

	addCharts(chartData): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<any>(`${BASE_URL}/asset_data/finance`, chartData, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
			}
		});
	}

	getAssetDataById(assetDataId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any>(`${BASE_URL}/asset_data/${assetDataId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	deleteAssetData(assetDataId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<any>(`${BASE_URL}/asset_data/${assetDataId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	updateAssetData(asset, assetId): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.put<any>(`${BASE_URL}/asset_data/${assetId}`, asset, {
			headers: {
				'Authorization': 'Bearer ' + userToken
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

	getAllAssets(): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/asset/all`, {
			headers: {
				'Authorization': 'Bearer ' + userToken,
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

	getAssetsData(skip, limit, assetsId): Observable<any[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.get<any[]>(`${BASE_URL}/asset/asset_data/${assetsId}`, {
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
				'Authorization': 'Bearer ' + userToken
			}
		});
	}

	// delete a asset
	deleteAsset(assetId: string): Observable<any> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		return this.http.delete<any>(`${BASE_URL}/asset/${assetId}`, {
			headers: {
				'Authorization': 'Bearer ' + userToken
			}
		});
	}
}
