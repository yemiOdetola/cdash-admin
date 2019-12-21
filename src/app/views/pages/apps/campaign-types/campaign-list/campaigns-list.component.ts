// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { CampaignTypeModel, CampaignsService } from '../../../../../core/campaign-types';

// material for table
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-campaigns-list',
	templateUrl: './campaigns-list.component.html',
	styleUrls: ['./campaigns-list.component.scss']
})
export class CampaignsListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingColumns: string[] = ['Name', 'Price', 'Description'];
	campaignTypeList: CampaignTypeModel[];
	dataSource: any;
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	constructor(private campaignTypeService: CampaignsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.campaignTypeService.getCampaignTypesCount().subscribe(
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
		let skip = 0;
		let limit = 999999999;
		this.getCampTypes(skip, limit);
	}

	countCampTypes() {
		this.campaignTypeService.getCampaignTypesCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}
	getCampTypes(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.campaignTypeService.getCampaignTypes(skip, limit).subscribe(
			responseData => {
				this.campaignTypeList = responseData['success'];
				this.dataSource = new MatTableDataSource<CampaignTypeModel>(this.campaignTypeList);
				this.loadingSubject.next(false);
				console.log('all campaignsTypes returned', this.campaignTypeList);
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
		this.getCampTypes(skip, this.limit);
		this.countCampTypes();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getCampTypes(skip, this.limit);
		this.countCampTypes();
		this.itemNav();
	}

	ngOnDestroy() { }
}
