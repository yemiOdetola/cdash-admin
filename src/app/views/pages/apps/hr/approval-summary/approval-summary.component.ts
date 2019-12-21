// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { ClaimModel, ClaimsService } from '../../../../../core/claims';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';

// material for table
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
	selector: 'kt-approval-summary',
	templateUrl: './approval-summary.component.html',
	styleUrls: ['./approval-summary.component.scss']
})
export class ApprovalSummaryComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	approvedSummaryClaim: any;
	approvedSummaryLeave: any;
	approvedSummaryLoan: any;
	dataSource: any;
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	claimMap: object = {};
	disablePrev = true;
	disableNext: boolean;
	approvalSummaryClaim = [];
	approvalSummaryLeave = [];
	approvalSummaryLoan = [];
	approvalItemsSummary = [];
	claimI;
	claimDetailName;
	itemSource: any;
	summaryColumns;
	showClaimsList = true;
	showClaimItems: boolean;
	pleaseHide = false;
	activeList = 'claims';
	// dataSource = new MatTableDataSource(LEAD_DATA);
	constructor(
		private claimsService: ClaimsService,
		private layoutUtilsService: LayoutUtilsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.getApprovalSummaryClaim();
		this.getApprovalSummaryLeave();
		this.getApprovalSummaryLoan();
	}

	switchList(list) {
		return this.activeList = list;
	}

	countClaims() {
		this.claimsService.getClaimsCount(1, 'loan', '').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}

	getApprovalSummaryClaim() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimsService.getApprovalSummary('claim', '').subscribe(
			responseData => {
				this.approvedSummaryClaim = responseData['success'];
				if (this.approvedSummaryClaim) {
					this.approvedSummaryClaim.forEach(apprSum => {
						this.approvalSummaryClaim.push(apprSum._id);
					});
				}
				console.log('all approved claims returned', this.approvedSummaryClaim);
				console.log('this.approvalSummary>>>', this.approvalSummaryClaim);
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			});
	}

	getApprovalSummaryLeave() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimsService.getApprovalSummary('leave', '').subscribe(
			responseData => {
				this.approvedSummaryLeave = responseData['success'];
				if (this.approvedSummaryLeave) {
					this.approvedSummaryLeave.forEach(apprSum => {
						this.approvalSummaryLeave.push(apprSum._id);
					});
				}
				console.log('all approved leave returned', this.approvedSummaryLeave);
				console.log('this.approvalSummaryLeave>>>', this.approvalSummaryLeave);
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			});
	}

	getApprovalSummaryLoan() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimsService.getApprovalSummary('loan', '').subscribe(
			responseData => {
				this.approvedSummaryLoan = responseData['success'];
				if (this.approvedSummaryLoan) {
					this.approvedSummaryLoan.forEach(apprSum => {
						this.approvalSummaryLoan.push(apprSum._id);
					});
				}
				console.log('all approved loans returned', this.approvedSummaryLoan);
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			});
	}

	getApprovalItemSummary() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimsService.getApprovalItemSummary('loan', '').subscribe(
			responseData => {
				this.summaryColumns = responseData['success'];
				if (this.summaryColumns && this.summaryColumns.length > 0) {
					this.summaryColumns.forEach(sumCol => {
						this.approvalItemsSummary.push(sumCol.hr_id);
					});
				}
				// this.approvalItemsSummary.push(this.summaryColumns.hr_id);
				this.getAllHRs();
				this.itemSource = new MatTableDataSource<any>(this.summaryColumns);
				console.log('all approved ITEMS returned', this.summaryColumns);
				console.log('this.approvalItemdSummary>>>', this.approvalItemsSummary);

				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			});
	}

	getClaimDetails(id) {
		this.claimsService.getClaimById(id).subscribe(
			singleClaim => {
				this.claimDetailName = singleClaim['success'].name;
				console.log('this claim detail name onInit', this.claimDetailName);
				this.claimMap[singleClaim['success']._id] = singleClaim['success'].name;
				console.log('>>>>>>', singleClaim['success'].name);
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
	}

	getAllHRs() {
		this.summaryColumns.forEach(summ => {
			this.getClaimDetails(summ.hr_id);
		});
	}

	handleShowClaimItems(el) {
		this.pleaseHide = el.checked;
		if (this.pleaseHide === true) {
			this.getApprovalItemSummary();
			this.showClaimsList = false;
		} else {
			this.showClaimsList = true;
		}
	}

	postApproval() {
		if (this.activeList === 'claims') {
			if (this.pleaseHide === false) {
				this.approveAll('claim', this.approvalSummaryClaim);
			}
			if (this.pleaseHide === true) {
				this.approveAll('claim', this.approvalItemsSummary);
			}
		}

		if (this.activeList === 'loans') {
			this.approveAll('loan', this.approvalSummaryLoan);
		}

		if (this.activeList === 'leaves') {
			this.approveAll('leave', this.approvalSummaryLeave);
		}
	}

	approveAll(type, list) {
		this.claimsService.approveApproval(type, {list}).subscribe(
			singleClaim => {
				this.claimDetailName = singleClaim['success'].name;
				console.log('this claim detail name onInit', this.claimDetailName);
				this.claimMap[singleClaim['success']._id] = singleClaim['success'].name;
				this.getApprovalSummaryLeave();
				this.getApprovalSummaryClaim();
				this.getApprovalSummaryLoan();
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
	}

	ngOnDestroy() { }
}
