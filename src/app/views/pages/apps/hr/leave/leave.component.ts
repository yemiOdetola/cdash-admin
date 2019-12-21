import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimModel, ClaimsService } from '../../../../../core/claims';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { UserService } from '../../../../../core/users';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-leave',
	templateUrl: './leave.component.html',
	styleUrls: ['./leave.component.scss']
})
export class LeaveComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	leaveId: string;
	leaveDetails: any;
	pageTitle = 'Please wait...';
	userDetails;
	claimDetails: any;
	singleClaimType;
	constructor(
		private route: ActivatedRoute,
		private claimsService: ClaimsService,
		private _location: Location,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router,
		private usersService: UserService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.leaveId = this.route.snapshot.params['id'];
		this.claimsService.getClaimById(this.leaveId).subscribe(
			singleLeave => {
				this.leaveDetails = singleLeave['success'];
				console.log('this lead details oninit', this.leaveDetails);
				this.loadingSubject.next(false);
				this.pageTitle = `Leave - ${this.leaveDetails.name}`;
				this.getUserDetails(this.leaveDetails.creator_id);
				this.getSingleClaimType(this.leaveDetails.claim_type_id);
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
		console.log('id returned', this.route.snapshot.params['id']);
	}

	goBack() {
		this._location.back();
	}

	getSingleClaimType(id) {
		this.claimsService.getClaimType(id).subscribe(
			singleType => {
				this.singleClaimType = singleType['success'];
				console.log('this claim leavess leavess', this.singleClaimType);
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
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

	onDelete() {
		const _title: string = 'Delete Leave';
		const _description: string = 'Are you sure to permanently delete this Leave?';
		const _waitDesciption: string = 'Leave will be deleting...';
		const _deleteMessage = `lead has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.claimsService.deleteRequest(this.leaveId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/strada/leaves/leaves']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}

	approveLeave(id) {
		this.loadingSubject.next(true);
		const _approveMessage = 'Approval Successful';
		const _errorMessage = 'Approval Failed';
		this.claimsService.approveSingleHR(id).subscribe(
			response => {
				console.log('approve singleclaim response full>>>>', response);
				this.layoutUtilsService.showActionNotification(_approveMessage, MessageType.Delete);
				window.location.reload();
				this.loadingSubject.next(false);
			},
			error => {
				console.log('approve singleclaim error full>>>>', error);
				this.layoutUtilsService.showActionNotification(_errorMessage, MessageType.Delete);
			}
		);
	}
}
