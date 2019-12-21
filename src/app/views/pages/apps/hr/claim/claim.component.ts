import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimModel, ClaimsService } from '../../../../../core/claims';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { UserService } from '../../../../../core/users';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-claim',
	templateUrl: './claim.component.html',
	styleUrls: ['./claim.component.scss']
})
export class ClaimComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	claimId: string;
	claimDetails: any;
	dataSource: any;
	proceedingColumns: string[] = ['Amount', 'Description', 'Action'];
	pageTitle = 'Please wait...';
	addnew = false;
	addClaimForm: FormGroup;
	claimItems = [];
	totalAmount = 0;
	userDetails;
	singleClaimType;
	nairaSign = '₦';
	summaryItems: any;
	claimName = '';
	claimAmount;
	newClaim = 0;
	forwardArrow = '<img src="./assets/media/icons/details-edit.svg" alt="">';
	constructor(
		private route: ActivatedRoute,
		private claimsService: ClaimsService,
		private layoutUtilsService: LayoutUtilsService,
		private _location: Location,
		private router: Router,
		private fb: FormBuilder,
		private usersService: UserService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimId = this.route.snapshot.params['id'];
		this.initClaimsForm();
		this.getClaimDetails();
		this.loadingSubject.next(false);
		console.log('id returned', this.route.snapshot.params['id']);
	}

	goBack() {
		this._location.back();
	}

	submitClaim() {
		console.log(this.claimName, this.claimAmount, 'name value');
	}

	setName(name) {
		this.claimName = name;
	}

	setAmount(amount) {
		this.claimAmount = amount;
	}

	getUserDetails(id) {
		this.loadingSubject.next(true);
		this.usersService.getUserById(id).subscribe(
			singleUser => {
				this.userDetails = singleUser['user'];
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error occured', error);
			}
		);
	}
	// getApprovalItemSummary
	getClaimDetails() {
		this.claimsService.getClaimById(this.claimId).subscribe(
			singleClaim => {
				this.totalAmount = 0;
				this.claimDetails = singleClaim['success'];
				console.log('this claim details oninit', this.claimDetails);
				this.pageTitle = `Claim - ${this.claimDetails.name}`;
				this.getUserDetails(this.claimDetails.creator_id);
				this.getSingleClaimType(this.claimDetails.claim_type_id);
				this.getAllClaims();
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
	}

	// getClaimType
	getSingleClaimType(id) {
		this.claimsService.getClaimType(id).subscribe(
			singleType => {
				this.singleClaimType = singleType['success'];
				console.log('this claim details oninit', this.claimDetails);
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
	}

	onDelete() {
		const _title: string = 'Delete Claim';
		const _description: string = 'Are you sure to permanently delete this Claim?';
		const _waitDesciption: string = 'Claim will be deleting...';
		const _deleteMessage = `lead has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.claimsService.deleteRequest(this.claimId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/strada/hr/claims']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}

	initClaimsForm() {
		this.addClaimForm = this.fb.group({
			claim: ['', Validators.required],
			amount: ['', Validators.required],
			description: ['', Validators.required]
		});
	}

	toggleAdd() {
		return this.addnew = !this.addnew;
	}

	getAllClaims() {
		this.claimsService.getAllClaimItems(this.claimId).subscribe(
			claimItemsAll => {
				this.totalAmount = 0;
				this.claimItems = claimItemsAll['success'];
				this.claimItems.forEach(claim => {
					this.totalAmount += claim.amount;
				});
			},
			error => {
				this.loadingSubject.next(false);
				console.log('error occured', error);
				const message = 'Sorry, Not Getting Claims';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			}
		);
		this.loadingSubject.next(false);
	}

	addClaim() {
		if (this.claimAmount < 1 || this.claimName === '') {
			this.layoutUtilsService.showActionNotification('You need to add a valid claim', MessageType.Create, 2000, true, true);
			return;
		}
		this.loadingSubject.next(true);
		let payload = {};
		const claim = this.claimName;
		const amount = this.claimAmount;
		const description = this.claimName;
		payload = { ...payload, claim, amount, description };
		this.claimsService.addNewClaimItem(payload, this.claimId).subscribe(
			data => {
				this.loadingSubject.next(false);
				const message = `Successfully Added`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.getClaimDetails();
				this.toggleAdd();
				this.newClaim = this.newClaim + 1;
			}, error => {
				this.loadingSubject.next(false);
				if (error.error.error === 'Not authorized') {
					this.layoutUtilsService.showActionNotification('You\'re not authorized!.', MessageType.Create, 10000, true, true);
					return;
				}
				console.log('error.error.error', error.error.error);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	deleteClaim(claim) {
		const _title: string = 'Remove Claim';
		const _description: string = 'Are you sure to remove this Claim?';
		const _waitDesciption: string = 'Removing Claim';
		const _deleteMessage = `Claim has been Removed`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.claimsService.deleteItemFromClaim(claim._id).subscribe(
				deleted => {
					this.getClaimDetails();
					this.loadingSubject.next(true);
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
					this.loadingSubject.next(false);
				}
			);
		});
	}

	approveClaim(id) {
		this.loadingSubject.next(true);
		const _approveMessage = 'Approval Successful';
		const approvalError = 'Everyone has approved this Claim';
		const levelError = 'This claim has either passed or not gotten to your approval level';
		const _errorMessage = 'Approval Failed';
		const appError = 'Approval has gotten to the last stage. Approval failed';
		this.claimsService.approveSingleHR(id).subscribe(
			response => {
				if (response['success']) {
					this.layoutUtilsService.showActionNotification(_approveMessage, MessageType.Delete);
					window.location.reload();
					this.loadingSubject.next(false);
				}
				if (response['error'] === 'Everyone has approved') {
					this.layoutUtilsService.showActionNotification(approvalError, MessageType.Delete);
					this.loadingSubject.next(false);
				}
				if (response['error'] === 'Approval has gotten to the last stage, Approve at the final stage') {
					this.layoutUtilsService.showActionNotification(appError, MessageType.Delete);
					this.loadingSubject.next(false);
				}
				if (response['error'] === 'This claim has either passed or not gotten to your approval level') {
					this.layoutUtilsService.showActionNotification(levelError, MessageType.Delete);
					this.loadingSubject.next(false);
				}
			},
			error => {
				console.log('approve singleclaim error full>>>>', error);
				this.layoutUtilsService.showActionNotification(_errorMessage, MessageType.Delete);
			}
		);
	}
}
