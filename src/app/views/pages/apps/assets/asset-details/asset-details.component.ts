import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetsService } from '../../../../../core/assets';
import { UserService } from '../../../../../core/users';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';
// 5dfdd01afabafa20ae8c79e1
@Component({
	selector: 'kt-asset-details',
	templateUrl: './asset-details.component.html',
	styleUrls: ['./asset-details.component.scss']
})
export class AssetDetailsComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	assetDataId: string;
	assetDetails: any;
	pageTitle = 'Asset details';
	currency = '₦';
	assetDataObjKeys = Object.keys;
	staffs: any;
	biz_owners;
	allStaffs = [];
	normBiznez: any;
	customData;
	naira = '₦';
	ty$Sign = '$';
	projectedCost;
	selected = 'details';
	historicalCost = [];
	recurrentData = [];
	constructor(
		private route: ActivatedRoute,
		private assetsService: AssetsService,
		private _location: Location,
		private usersService: UserService,
		private layoutUtilsService: LayoutUtilsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.assetDataId = this.route.snapshot.params['id'];
		this.assetsService.getAssetDataById(this.assetDataId).subscribe(
			singleAsset => {
				this.assetDetails = singleAsset['data'];
				this.getAllStaffs();
				if (this.assetDetails.business_owners[0]) {
					this.biz_owners = this.assetDetails.business_owners[0];
					if (this.biz_owners.length > 1) {
						this.normBiznez = this.biz_owners.split(',');
					}
				}
				if (this.assetDetails.historical_data) {
					this.historicalCost = this.assetDetails.historical_data;
				}
				if (this.assetDetails.recurrent_year) {
					this.recurrentData = this.assetDetails.recurrent_year;
				}
				if (this.assetDetails.custom_data) {
					this.customData = JSON.parse(this.assetDetails.custom_data);
				}
				if (this.assetDetails.projected_cost) {
					this.projectedCost = this.assetDetails.projected_cost;
				}
				this.loadingSubject.next(false);
				if (this.assetDetails.currency === 'naira') {
					this.currency = '₦';
				} else {
					this.currency = '$';
				}
				this.pageTitle = `${this.assetDetails.name}`;
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
		console.log('id returned', this.route.snapshot.params['id']);
	}

	selectMenu(menu) {
		this.selected = menu;
	}

	getAllStaffs() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.usersService.getStaffs(0, 999).subscribe(
			response => {
				this.staffs = response['data'];
				if (this.normBiznez && this.normBiznez.length > 0) {
					this.normBiznez.forEach(biz => {
						this.staffs.forEach(staff => {
							if (biz === staff._id) {
								console.log('staff found', staff.name);
								this.allStaffs.push(staff);
							}
						});
					});
				}
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			}
		);
	}

	goBack() {
		this._location.back();
	}

	onDelete() {
		const _title: string = 'Delete asset';
		const _description: string = 'Are you sure to permanently delete this asset?';
		const _waitDesciption: string = 'Please wait...';
		const _deleteMessage = `Asset has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.assetsService.deleteAssetData(this.assetDataId).subscribe(
				deleted => {
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.goBack();
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}
}
