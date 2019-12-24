// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { AssetsService } from '../../../../../core/assets';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'kt-assets-data',
	templateUrl: './assets-data.component.html',
	styleUrls: ['./assets-data.component.scss']
})
export class AssetsDataComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	assets: any[];
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	containerId = '';
	containerAssets;
	constructor(
		private assetsService: AssetsService,
		private route: ActivatedRoute,
		private router: Router
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.containerId = this.route.snapshot.params['id'];
		this.assetsService.getAssetContainerById(this.containerId).subscribe(
			assetsData => {
				this.containerAssets = assetsData['data'];
				localStorage.setItem('formElement', JSON.stringify(assetsData['data']));
				console.log('this lead details oninit', this.containerAssets);
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
		let skip = this.pageIndex * this.limit;
		this.getAssetsData(skip, this.limit);
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

	getAssetsData(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.assetsService.getAssetsData(skip, limit).subscribe(
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
		this.getAssetsData(skip, this.limit);
		this.countAssets();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getAssetsData(skip, this.limit);
		this.countAssets();
		this.itemNav();
	}

	ngOnDestroy() { }
}

