// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { AssetsService } from '../../../../../core/assets';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';

@Component({
	selector: 'kt-assets-list',
	templateUrl: './assets-list.component.html',
	styleUrls: ['./assets-list.component.scss']
})
export class AssetsListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	assets: any[];
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	// dataSource = new MatTableDataSource(LEAD_DATA);
	constructor(
		private assetsService: AssetsService,
		private layoutUtilsService: LayoutUtilsService
		) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.assetsService.getAssetsCount().subscribe(
			countResult => {
				this.resultsLength = countResult['data'];
				if ( this.resultsLength <= 10) {
					console.log('not up to 10', this.resultsLength);
					this.disableNext = true;
				} else {
					console.log('up to 10', this.resultsLength);
					this.disableNext = false;
				}
			}
		);
		let skip = this.pageIndex * this.limit;
		this.getAssets(skip, this.limit);
	}

	countAssets() {
		this.assetsService.getAssetsCount().subscribe(
			countResult => {
				this.resultsLength = countResult['data'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}

	getAssets(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.assetsService.getAssets(skip, limit).subscribe(
			responseData => {
				this.assets = responseData['data'];
				this.loadingSubject.next(false);
				console.log('all assets returned', this.assets);
			},
			error => {
				console.log('error', error);
			});
	}

	itemNav() {
		if (((this.pageIndex * 10) + 10) >= this.resultsLength) {
			this.disableNext = true;
			console.log('paste total numbers');
		} else {
			this.disableNext = false;
		}
		if (this.pageIndex === 0) {
			this.disablePrev = true;
			console.log('last page');
		} else {
			this.disablePrev = false;
		}
	}
	getNext() {
		this.pageIndex = this.pageIndex + 1;
		let skip = this.pageIndex * this.limit;
		this.getAssets(skip, this.limit);
		this.countAssets();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getAssets(skip, this.limit);
		this.countAssets();
		this.itemNav();
	}

	onDelete(assetId) {
		const _title: string = 'Delete Asset';
		const _description: string = 'Are you sure to permanently delete this asset and its data?';
		const _waitDesciption: string = 'Asset will be deleted';
		const _deleteMessage = `Succesful`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.assetsService.deleteAsset(assetId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					let skip = this.pageIndex * this.limit;
					this.getAssets(skip, this.limit);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}

	ngOnDestroy() { }
}

