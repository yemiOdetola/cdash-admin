// Angular
import { Component, OnInit, OnDestroy , ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { ClaimModel, ClaimsService } from '../../../../../core/claims';
import { RoleModel, RolesService } from '../../../../../core/roles';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-claim-edit',
	templateUrl: './claim-edit.component.html',
	styleUrls: ['./claim-edit.component.scss']
})
export class ClaimEditComponent implements OnInit, OnDestroy {
	claim: ClaimModel;
	image: any;
	roles: RoleModel[];
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldCClaim: ClaimModel;
	claimForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	objectKeys = Object.keys;
	cRole: string;
	rolesE: any = [];
	selectedRole: any;
	selectedTab: number = 0;
	selectedFile: File = null;
	idParams: string;
	good: string;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private claimsService: ClaimsService,
		private rolesService: RolesService,
		private ref: ChangeDetectorRef
	) {

	 //
	}

	getRoles() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.rolesService.getEveryRoles().subscribe(
			responseData => {
				this.roles = responseData['success'];
				 this.roles.push({name: 'Administrator', permission: 'ADMIN'});
				this.loadingSubject.next(false);
				console.log('all roles returned', this.roles);
			},
			error => {
				console.log('error', error);
			}
		);
	}
	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
         this.getRoles();
		console.log('ClaimEditComponent initiated');
		this.initClaimForm();
		if (this.activatedRoute.snapshot.params['id']) {
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getClaimDetails().subscribe(claimData => this.initClaimForm(claimData));
			this.loadingSubject.next(true);
		} else {
			this.claim = this.claimForm.value;
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.claimForm.value);
		console.log('form control', this.claimForm.controls);
	}

	passRole(event) {
		console.log('event value for role', event.target.value);
		this.cRole = event.target.value;
	}

	roleChanged(role) {
		this.cRole = role.name;
	}

	getClaimDetails() {
	return this.claimsService.getClaimById(this.idParams).pipe(
			map(claimDetails => {
				this.claim = claimDetails['claim'];
				this.loadingSubject.next(false);
				console.log('retrieving claim with pipe', this.claim);
				return this.claim;
			})
		);
	}

	initClaimForm(claim: any = {}) {
	this.claimForm = this.fb.group({
			name: [claim.name || '', Validators.required],
		});

	}
	titleCase(str: any) {
		let splitStr = str.toLowerCase().split(' ');
		for (let i = 0; i < splitStr.length; i++) {
			splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
		}
		return splitStr.join(' ');
	 }
	getComponentTitle() {
		let result = 'Please Wait';
		if (!this.claim || !this.claim._id) {
			result = 'Create new approval flow';
			return result;
		}
		result = `Edit Claim -  ${this.titleCase(this.claim.name)}`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.claimForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.claimForm.invalid || this.rolesE.length <= 0) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.claim._id) {
			console.log('Claim has an Id');
			let editedClaim = this.claimForm.value;
			console.log('Claim to send', editedClaim);
			this.updateClaim(editedClaim);
			return;
		}
		this.addClaim(this.claimForm.value);
	}

	updateClaim(claim) {
		this.claimsService.updateRequest(claim, this.claim._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Updated Successfully`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/users/claims']);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}
	/**
	 * Add Claim
	 *
	 * @param _claim: ClaimModel
	 * @param withBack: boolean
	 */
	addClaim(_claim: ClaimModel, withBack: boolean = false) {
		this.loadingSubject.next(true);
		const payload = this.claimForm.value;
		payload.roles = this.rolesE;
		console.log(payload);
		this.claimsService.createClaimType(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `Claim has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/users/claims']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

    addPipeline() {
		if (this.cRole) {
			if (this.rolesE.indexOf(this.cRole ) > -1) {
				const message = `You already added this role to the `;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			} else {
				this.rolesE.push(this.cRole);
				this.cRole = null;
				this.ref.detectChanges();
			}
		}
		return true;
	}
	removePipeline() {
		this.rolesE.pop();
	}
	reset() {
		this.claim = Object.assign({}, this.oldCClaim);
		this.initClaimForm();
		this.hasFormErrors = false;
		this.claimForm.markAsPristine();
		this.claimForm.markAsUntouched();
		this.claimForm.updateValueAndValidity();
	}
	/**
	 * Close alert
	 *
	 * @param $event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() { }

}
