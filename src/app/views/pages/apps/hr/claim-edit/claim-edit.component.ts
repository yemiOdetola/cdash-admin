// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { ClaimModel, ClaimsService } from '../../../../../core/claims';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';

// imprts for date hiccup
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports

const moment = _moment;

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-claim-edit',
	templateUrl: './claim-edit.component.html',
	styleUrls: ['./claim-edit.component.scss'],
	providers: [
		{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
		{provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
	  ],
})
export class ClaimEditComponent implements OnInit, OnDestroy {
	claim: ClaimModel;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldClaim: ClaimModel;
	claimForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	idParams: string;
	// typeNames = ['claim', 'leave', 'loan'];
	types = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private claimsService: ClaimsService
	) {}

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.emptyClaimForm();
		this.getRequestTypes();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getClaimDetails().subscribe(claimData => this.initClaimForm(claimData));
			this.loadingSubject.next(true);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
	}

	getRequestTypes() {
		this.loadingSubject.next(true);
		return this.claimsService.getClaimTypes().subscribe(
			response => {
				this.types = response['success'];
				this.loadingSubject.next(false);
			},
			error => {
				this.loadingSubject.next(true);
				console.log('error getting types', error);
			}
		);
	}

	getClaimDetails() {
		return this.claimsService.getClaimById(this.idParams).pipe(
			map(claimDetails => {
				this.claim = claimDetails['success'];
				this.loadingSubject.next(false);
				console.log('retrieving claims with pipe', this.claim);
				return this.claim;
			})
		);
	}

	emptyClaimForm() {
		this.claimForm = this.fb.group({
			claim_type_id: ['', Validators.required],
			name: ['', Validators.required],
		});
	}

	initClaimForm(claim: any = {}) {
		this.claimForm = this.fb.group({
			claim_type_id: [claim.claim_type_id || '', Validators.required],
			name: [claim.name || '', Validators.required],
		});
	}
	getComponentTitle() {
		let result = 'Create Claim';
		if (!this.claim || !this.claim._id) {
			return result;
		}
		result = `Edit Claim -  ${this.claim.name}`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.claimForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.claimForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.claim && this.claim._id) {
			console.log('claim has an Id');
			let editedClaim = this.claimForm.value;
			console.log('Claim to send', editedClaim);
			this.updateClaim(editedClaim);
			return;
		}
		this.addClaim(this.claimForm.value);
	}

	updateClaim(claim) {
		this.loadingSubject.next(true);
		const remixedPayload = {
			name: claim.name,
			type: 'claim',
			claim_type_id: claim.claim_type_id,
			// description: claim.description
		};
		console.log('update request', remixedPayload);
		this.claimsService.updateRequest(remixedPayload, this.claim._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `New Claim has been Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/hr/claims/claims']);
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
	 * Add Lead
	 *
	 * @param _lead: LeadModel
	 * @param withBack: boolean
	 */
	addClaim(_claim: ClaimModel) {
		this.loadingSubject.next(true);
		const remixedPayload = {
			name: _claim.name,
			type: 'claim',
			claim_type_id: _claim.claim_type_id,
			// description: _claim.description
		};
		console.log('remixedPayload', remixedPayload);
		this.claimsService.createClaim(remixedPayload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `New Claim has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/hr/claims']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	reset() {
		this.claim = Object.assign({}, this.oldClaim);
		this.emptyClaimForm();
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
