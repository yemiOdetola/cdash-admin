// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { ComputationsService } from '../../../../../core/computations';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-computations-list',
	templateUrl: './computations-list.component.html',
	styleUrls: ['./computations-list.component.scss']
})
export class ComputationsListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	computations: any[];
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	constructor(private computationsService: ComputationsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.computationsService.countMaturityList().subscribe(
			countResult => {
				this.resultsLength = countResult['data'];
				this.loadingSubject.next(false);
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
		this.getMarities(skip, this.limit);
	}

	getMarities(skip, limit) {
		this.loadingSubject.next(true);
		this.computationsService.getMaturityList(skip, limit).subscribe(
			responseData => {
				this.computations = responseData['data'];
				this.loadingSubject.next(false);
				console.log('all contacts returned', this.computations);
			},
			error => {
				console.log('error', error);
			});
	}
	countMaturities() {
		this.loadingSubject.next(true);
		this.computationsService.countMaturityList().subscribe(
			countResult => {
				this.resultsLength = countResult['data'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
				this.loadingSubject.next(false);
			}
		);
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
		this.getMarities(skip, this.limit);
		this.countMaturities();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getMarities(skip, this.limit);
		this.countMaturities();
		this.itemNav();
	}

	ngOnDestroy() { }
}
