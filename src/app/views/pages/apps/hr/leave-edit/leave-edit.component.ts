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
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports

const moment = _moment;

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-leave-edit',
	templateUrl: './leave-edit.component.html',
	styleUrls: ['./leave-edit.component.scss'],
	providers: [
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
	],
})
export class LeaveEditComponent implements OnInit, OnDestroy {
	leave: ClaimModel;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldLeave: ClaimModel;
	leaveForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	idParams: string;
	types = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private claimsService: ClaimsService
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.emptyLeaveForm();
		this.getRequestTypes();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getLeaveDetails().subscribe(leaveData => this.initLeaveForm(leaveData));
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

	getLeaveDetails() {
		return this.claimsService.getClaimById(this.idParams).pipe(
			map(leaveDetails => {
				this.leave = leaveDetails['success'];
				this.loadingSubject.next(false);
				console.log('retrieving leaves with pipe', this.leave);
				return this.leave;
			})
		);
	}

	emptyLeaveForm() {
		this.leaveForm = this.fb.group({
			name: ['', Validators.required],
			start: ['', Validators.required],
			end: ['', Validators.required],
			description: ['', Validators.required],
			claim_type_id: ['', Validators.required]
		});
	}

	initLeaveForm(leave: any = {}) {
		let startDate = moment(leave.start).format('YYYY-MM-DD');
		let endDate = moment(leave.end).format('YYYY-MM-DD');
		this.leaveForm = this.fb.group({
			name: [leave.name || '', Validators.required],
			start: [startDate || '', Validators.required],
			end: [endDate || '', Validators.required],
			description: ['', Validators.required],
			claim_type_id: ['', Validators.required]
		});
	}
	getComponentTitle() {
		let result = 'Create Leave';
		if (!this.leave || !this.leave._id) {
			return result;
		}
		result = `Edit Leave -  ${this.leave.name}`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.leaveForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.leaveForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.leave && this.leave._id) {
			console.log('leave has an Id');
			let editedLeave = this.leaveForm.value;
			console.log('Leave to send', editedLeave);
			this.updateLeave(editedLeave);
			return;
		}
		this.addLeave(this.leaveForm.value);
	}

	updateLeave(leave) {
		this.loadingSubject.next(true);
		const convertedStart = moment(leave.start).valueOf();
		const convertedEnd = moment(leave.end).valueOf();
		const remixedPayload = {
			name: leave.name,
			type: 'leave',
			start: convertedStart,
			end: convertedEnd,
			description: leave.description,
			claim_type_id: leave.claim_type_id
		};
		console.log('update request', remixedPayload);
		this.claimsService.updateRequest(remixedPayload, this.leave._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `New Leave has been Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/hr/leaves']);
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
	addLeave(_leave: ClaimModel) {
		this.loadingSubject.next(true);
		let prepStart = new Date(_leave.start);
		let prepEnd = new Date(_leave.end);
		const convertedStart = prepStart.getTime();
		const convertedEnd = prepEnd.getTime();
		const remixedPayload = {
			name: _leave.name,
			type: 'leave',
			start: convertedStart,
			end: convertedEnd,
			description: _leave.description,
			claim_type_id: _leave.claim_type_id
		};
		console.log('remixedPayload', remixedPayload);
		this.claimsService.createLeave(remixedPayload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `New Leave has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/hr/leaves']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	reset() {
		this.leave = Object.assign({}, this.oldLeave);
		this.emptyLeaveForm();
		this.hasFormErrors = false;
		this.leaveForm.markAsPristine();
		this.leaveForm.markAsUntouched();
		this.leaveForm.updateValueAndValidity();
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
