// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { CallLogModel, CallsService } from '../../../../../core/calls';
import * as countries from './countries.json';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';

@Component({
	selector: 'kt-convert-to-lead',
	templateUrl: './convert-to-lead.component.html',
	styleUrls: ['./convert-to-lead.component.scss']
})
export class ConvertToLeadComponent implements OnInit, OnDestroy {
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
	county;
	convertId;
	objectKeys = Object.keys;
	countriesObj = countries;
	statuses = [
		'Lead Initiated', 'Email Sent', 'Scheduled Meeting', 'Sent MOU/Proposal',
		'Review MOU/Proposal', 'Follow Up Requested', 'Sent Invoice', 'Signed Agreement',
		'Converted to Contact'
	];
	industries = [
		'Others', 'ASP (Application Service Provider)', 'Data/Telecom OEM',
		'ERP (Enterprise Resource Planning)', 'Goverment/Miltary', 'Large Enterprise',
		'Management ISV', 'Network Equipment Enterprise', 'Non-Management ISV',
		'Optical Networking', 'Service Provider', 'Small/Medium Enterprise', 'Storage Equipment', 'Storage Service Provider', 'System Integrator', 'Wireless Industry'
	];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private fb: FormBuilder,
		private callsService: CallsService
	) { this.county = Object.keys(this.countriesObj); }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.convertId = this.activatedRoute.snapshot.params['id'];
		this.loadingSubject.next(true);
		this.initconvertToLeadForm();
		this.call = this.callLogForm.value;
		this.loadingSubject.next(false);
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.callLogForm.value);
		console.log('form control', this.callLogForm.controls);
	}

	initconvertToLeadForm(callLog: any = {}) {
		this.callLogForm = this.fb.group({
			title: [''],
			address: ['', Validators.required],
			status: ['', Validators.required],
			website: ['', Validators.required],
			email: ['', Validators.required],
			industry: ['', Validators.required],
			country: ['NG', Validators.required],
			description: ['', Validators.required],
		});
	}

	getComponentTitle() {
		let result = 'Add Call Details';
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
		this.addLead(this.callLogForm.value);
		return;
	}

	addLead(convertCall) {
		this.loadingSubject.next(true);
		const payload = convertCall;
		console.log(payload);
		this.callsService.convertLogToLead(payload, this.convertId).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `New Lead has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/leads/leads']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}


	reset() {
		this.call = Object.assign({}, this.oldCall);
		this.initconvertToLeadForm();
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
