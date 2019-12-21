import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetModel, AssetsService } from '../../../../../core/assets';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-asset',
	templateUrl: './asset.component.html',
	styleUrls: ['./asset.component.scss']
})
export class AssetComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	assetId: string;
	assetDetails: any;
	pageTitle = 'Please wait...';
	constructor(
		private route: ActivatedRoute,
		private assetsService: AssetsService,
		private layoutUtilsService: LayoutUtilsService,
		private _location: Location,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.assetId = this.route.snapshot.params['id'];
		this.assetsService.getAssetById(this.assetId).subscribe(
			singleAsset => {
				this.assetDetails = singleAsset['success'];
				console.log('this lead details oninit', this.assetDetails);
				this.loadingSubject.next(false);
				this.pageTitle = `${this.assetDetails.name}`;
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
		console.log('id returned', this.route.snapshot.params['id']);
	}


	goBack() {
		this._location.back();
	}

	onDelete() {
		const _title: string = 'Delete Asset';
		const _description: string = 'Are you sure to permanently delete this Asset?';
		const _waitDesciption: string = 'Asset will be deleting...';
		const _deleteMessage = `lead has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.assetsService.deleteAsset(this.assetId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/strada/assets/assets']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}
}
