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
	selector: 'kt-approved-list',
	templateUrl: './approved-list.component.html',
	styleUrls: ['./approved-list.component.scss']
})
export class ApprovedListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	approvedClaims: any;
	proceedingColumns: string[] = ['Claim', 'Total Amount', 'Updated On'];
	dataSource: any;
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	apprLoop = {};
	apprAmount = {};
	// dataSource = new MatTableDataSource(LEAD_DATA);
	constructor(private claimsService: ClaimsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimsService.approvedListCount(1, 'claim').subscribe(
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
		this.getApprovedList(skip, this.limit);
	}

	countClaims() {
		this.claimsService.getClaimsCount(1, 'claim','').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}

	getAllHRs() {
		this.approvedClaims.forEach(apprClaims => {
			this.getClaimDetails(apprClaims.hr_id);
		});
	}

	getClaimDetails(id) {
		this.claimsService.getClaimById(id).subscribe(
			singleClaim => {
				this.apprLoop[singleClaim['success']._id] = singleClaim['success'].name;
				this.apprAmount[singleClaim['success']._id] = singleClaim['success'].amount;
				console.log('>>>>>>', singleClaim['success'].name);
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
	}

	getApprovedList(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimsService.getApprovedList(skip, limit, 'claim', '').subscribe(
			responseData => {
				this.approvedClaims = responseData['success'];
				this.dataSource = new MatTableDataSource<ClaimModel>(this.approvedClaims);
				this.getAllHRs();
				console.log('all approved claims returned', this.approvedClaims);
				this.loadingSubject.next(false);
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
		this.getApprovedList(skip, this.limit);
		this.countClaims();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getApprovedList(skip, this.limit);
		this.countClaims();
		this.itemNav();
	}

	ngOnDestroy() { }
}

