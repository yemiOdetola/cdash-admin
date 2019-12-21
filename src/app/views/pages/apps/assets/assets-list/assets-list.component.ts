// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { AssetModel, AssetsService } from '../../../../../core/assets';

// material for table
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
	selector: 'kt-assets-list',
	templateUrl: './assets-list.component.html',
	styleUrls: ['./assets-list.component.scss']
})
export class AssetsListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	assets: AssetModel[];
	proceedingColumns: string[] = ['Assets Name', 'Starts On', 'Ends On'];
	dataSource: any;
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	// dataSource = new MatTableDataSource(LEAD_DATA);
	constructor(private assetsService: AssetsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.assetsService.getAssetsCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
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
				this.resultsLength = countResult['count'];
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
				this.assets = responseData['success'];
				// console.log('start data', responseData['success'][0].toString());
				this.dataSource = new MatTableDataSource<AssetModel>(this.assets);
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
			// return;
		} else {
			this.disableNext = false;
		}
		if (this.pageIndex === 0) {
			this.disablePrev = true;
			console.log('last page');
			// return;
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

	ngOnDestroy() { }
}

