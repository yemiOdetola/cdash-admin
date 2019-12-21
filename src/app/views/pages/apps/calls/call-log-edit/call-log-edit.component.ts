// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { CallLogModel, CallsService } from '../../../../../core/calls';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';

@Component({
	selector: 'kt-call-log-edit',
	templateUrl: './call-log-edit.component.html',
	styleUrls: ['./call-log-edit.component.scss']
})
export class CallLogEditComponent implements OnInit, OnDestroy {
	call: CallLogModel;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldCall: CallLogModel;
	callLogForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	selectedFile: File = null;
	idParams: string;
	campaignTypes = [];
	callTypes = ['INCOMING', 'OUTGOING'];
	ratings = ['pending', 'invoice', 'ready', 'commited'];
	sources = [
		'Advertisement', 'Code Call', 'Employee Referral', 'External Referrer',
		'Online Store', 'Partner', 'Public Relations', 'Sales Email Alias',
		'Seminar Partner', 'Trade Show', 'Web Download', 'Web Research', 'Chat'
	];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private callsService: CallsService
	) { }

	ngOnInit() {
		this.callsService.getCampaignTypes().subscribe(
			campaigns => {
				this.campaignTypes = campaigns['success'];
				console.log('campaign types', this.campaignTypes);
			}
		);
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.initCallLogForm();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getCallLogDetails().subscribe(contactData => this.editCallLogForm(contactData));
			this.loadingSubject.next(true);
			this.editCallLogForm();
		} else {
			this.call = this.callLogForm.value;
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.callLogForm.value);
		console.log('form control', this.callLogForm.controls);
	}
	// contact
	getCallLogDetails() {
		return this.callsService.getCallLogById(this.idParams).pipe(
			map(callDetails => {
				this.call = callDetails['success'];
				this.loadingSubject.next(false);
				console.log('retrieving call logs with pipe', this.call);
				return this.call;
			})
		);
	}

	editCallLogForm(callLog: any = {}) {
		this.callLogForm = this.fb.group({
			name: [callLog.name || '', Validators.required],
			location: [callLog.location || '', Validators.required],
			phone: [callLog.phone || '', Validators.required],
			source: [callLog.source || '', Validators.required],
			remarks: [callLog.remarks || '', Validators.required],
			type: [callLog.type || '', Validators.required],
			organization: [callLog.organization || '', Validators.required],
		});
	}

	initCallLogForm(callLog: any = {}) {
		this.callLogForm = this.fb.group({
			name: ['', Validators.required],
			location: ['', Validators.required],
			type_id: ['', Validators.required],
			phone: ['', Validators.required],
			source: ['', Validators.required],
			remarks: ['', Validators.required],
			type: ['', Validators.required],
			organization: ['', Validators.required],
		});
	}

	getComponentTitle() {
		let result = 'Please Wait';
		if (this.call) {
			result = `Edit Call Log -  ${this.call.name}`;
			return result;
		}
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.callLogForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.callLogForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		let editedCall = this.callLogForm.value;
		this.updateContact(editedCall);
		console.log('Call to send', editedCall);
		return;
	}

	updateContact(call) {
		this.callsService.updateCallLog(call, this.call._id).subscribe(
			data => {
				this.loadingSubject.next(false);
				const message = `Call log has been Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/calls/calls']);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}


	reset() {
		this.call = Object.assign({}, this.oldCall);
		this.initCallLogForm();
		this.hasFormErrors = false;
		this.callLogForm.markAsPristine();
		this.callLogForm.markAsUntouched();
		this.callLogForm.updateValueAndValidity();
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
