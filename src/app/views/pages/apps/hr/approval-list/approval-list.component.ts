// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { ClaimModel, ClaimsService } from '../../../../../core/claims';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';

// material for table
import { MatTableDataSource } from '@angular/material/table';

@Component({
	selector: 'kt-approval-list',
	templateUrl: './approval-list.component.html',
	styleUrls: ['./approval-list.component.scss']
})
export class ApprovalListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	approvedClaims: any;
	approvedLeaves: any;
	approvedLoans: any;
	proceedingColumns: string[] = ['Name', 'Created On', 'Updated On'];
	dataSource: any;
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	activeList = 'all';
	allApproved: any;
	// dataSource = new MatTableDataSource(LEAD_DATA);
	constructor(
		private claimsService: ClaimsService,
		private layoutUtilsService: LayoutUtilsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.getApprovedAll();
		this.countClaims();
		this.countLeaves();
		this.countLoans();
		this.getApprovedClaims();
		this.getApprovedLeaves();
		this.getApprovedLoans();
	}

	countClaims() {
		this.claimsService.getClaimsCount(1, 'claim', '').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				} else {
					console.log('up to 10', this.resultsLength);
					this.disableNext = false;
				}
			}
		);
	}

	countLoans() {
		this.claimsService.getClaimsCount(1, 'loan', '').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				} else {
					console.log('up to 10', this.resultsLength);
					this.disableNext = false;
				}
			}
		);
	}

	countLeaves() {
		this.claimsService.getClaimsCount(1, 'leave', '').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				} else {
					console.log('up to 10', this.resultsLength);
					this.disableNext = false;
				}
			}
		);
	}

	switchList(list) {
		return this.activeList = list;
	}
	// getApprovalListAll

	getApprovedAll() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimsService.getApprovalListAll('').subscribe(
			responseData => {
				if (responseData['success']) {
					this.allApproved = responseData['success'];
					this.loadingSubject.next(false);
				}
			},
			error => {
				console.log('error', error);
			});
	}

	getApprovedClaims() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimsService.getApprovalList('claim', '').subscribe(
			responseData => {
				this.approvedClaims = responseData['success'];
				if (responseData['success']) {
					this.dataSource = new MatTableDataSource<ClaimModel>(this.approvedClaims);
					console.log('all approved claims returned', this.approvedClaims);
					this.loadingSubject.next(false);
				}
				if (responseData['error'] === 'Approval has gotten to the last stage, Approve at the final stage') {
					const message = `Success`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				}
			},
			error => {
				console.log('error', error);
			});
	}
	getApprovedLeaves() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimsService.getApprovalList('leave', '').subscribe(
			responseData => {
				this.approvedLeaves = responseData['success'];
				if (responseData['success']) {
					console.log('all approved leaves returned', this.approvedLeaves);
					this.loadingSubject.next(false);
				}
				if (responseData['error'] === 'Approval has gotten to the last stage, Approve at the final stage') {
					const message = `Success`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				}
			},
			error => {
				console.log('error', error);
			});
	}

	getApprovedLoans() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimsService.getApprovalList('loan', '').subscribe(
			responseData => {
				this.approvedLoans = responseData['success'];
				if (responseData['success']) {
					console.log('all approved loans returned', this.approvedLoans);
					this.loadingSubject.next(false);
				}
				if (responseData['error'] === 'Approval has gotten to the last stage, Approve at the final stage') {
					const message = `Successful`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				}
			},
			error => {
				console.log('error', error);
			});
	}
	// itemNav() {
	// 	if (((this.pageIndex * 10) + 10) >= this.resultsLength) {
	// 		this.disableNext = true;
	// 		console.log('paste total numbers');
	// 		// return;
	// 	} else {
	// 		this.disableNext = false;
	// 	}
	// 	if (this.pageIndex === 0) {
	// 		this.disablePrev = true;
	// 		console.log('last page');
	// 		// return;
	// 	} else {
	// 		this.disablePrev = false;
	// 	}
	// }
	// getNext() {
	// 	this.pageIndex = this.pageIndex + 1;
	// 	let skip = this.pageIndex * this.limit;
	// 	this.getApprovedClaims(skip, this.limit);
	// 	this.countClaims();
	// 	this.itemNav();
	// }

	// getPrev() {
	// 	this.pageIndex = this.pageIndex - 1;
	// 	let skip = this.pageIndex * this.limit;
	// 	this.getApprovedClaims(skip, this.limit);
	// 	this.countClaims();
	// 	this.itemNav();
	// }

	ngOnDestroy() { }
}

