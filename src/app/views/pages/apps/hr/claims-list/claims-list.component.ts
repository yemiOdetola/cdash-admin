// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { ClaimModel, ClaimsService } from '../../../../../core/claims';

// material for table
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
	selector: 'kt-claims-list',
	templateUrl: './claims-list.component.html',
	styleUrls: ['./claims-list.component.scss']
})
export class ClaimsListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	claims: ClaimModel[];
	proceedingColumns: string[] = ['Name', 'Created On', 'Updated On'];
	dataSource: any;
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	// dataSource = new MatTableDataSource(LEAD_DATA);
	constructor(private claimsService: ClaimsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimsService.getClaimsCount(1, 'claim', '').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.resultsLength <= 10) {
					console.log('not up to 10', this.resultsLength);
					this.disableNext = true;
				} else {
					console.log('up to 10', this.resultsLength);
					this.disableNext = false;
				}
			}
		);
		let skip = this.pageIndex * this.limit;
		this.getClaims(skip, this.limit);
	}

	countClaims() {
		this.claimsService.getClaimsCount(1, 'claim', '').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}

	getClaims(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimsService.getClaims(skip, limit, 'claim', '').subscribe(
			responseData => {
				this.claims = responseData['success'];
				this.dataSource = new MatTableDataSource<ClaimModel>(this.claims);
				this.loadingSubject.next(false);
				console.log('all claims returned', this.claims);
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
		this.getClaims(skip, this.limit);
		this.countClaims();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getClaims(skip, this.limit);
		this.countClaims();
		this.itemNav();
	}

	ngOnDestroy() { }
}

