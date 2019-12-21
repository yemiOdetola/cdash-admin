// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { LeadModel, LeadsService } from '../../../../../core/leads';
import * as countries from './countries.json';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-lead-edit',
	templateUrl: './lead-edit.component.html',
	styleUrls: ['./lead-edit.component.scss']
})
export class LeadEditComponent implements OnInit, OnDestroy {
	lead: LeadModel;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldLead: LeadModel;
	leadForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	objectKeys = Object.keys;
	county;
	country;
	sortedCountries = [];
	countriesObj = countries;
	selectedTab: number = 0;
	selectedFile: File = null;
	idParams: string;
	fSelected;
	fileName = '';
	switchInstruction = true;
	titles = ['Mrs.', 'Mr.', 'Dr.', 'Miss'];
	ratings = ['pending', 'invoice', 'ready', 'commited', 'scammer'];
	sources = [
		'Advertisement', 'Code Call', 'Employee Referral', 'External Referrer',
		'Online Store', 'Partner', 'Public Relations', 'Sales Email Alias',
		'Seminar Partner', 'Trade Show', 'Web Download', 'Web Research', 'Chat'
	];
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
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private leadsService: LeadsService
	) {
		for (let country in this.countriesObj) {
			this.sortedCountries.push([country, this.countriesObj[country]]);
		}
		this.sortedCountries.sort((a, b) => {
			return a[1] - b[1];
		});
		console.log(this.sortedCountries, 'sorted countries now');
		this.county = Object.keys(this.countriesObj);
	}

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.initLeadForm();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getLeadDetails().subscribe(leadData => this.initLeadForm(leadData));
			this.loadingSubject.next(true);
		} else {
			this.lead = this.leadForm.value;
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.leadForm.value);
		console.log('form control', this.leadForm.controls);
	}

	getLeadDetails() {
		return this.leadsService.getLeadById(this.idParams).pipe(
			map(leadDetails => {
				this.lead = leadDetails['success'];
				this.loadingSubject.next(false);
				console.log('retrieving leads with pipe', this.lead);
				return this.lead;
			})
		);
	}

	getComponentTitle() {
		let result = 'Create Lead';
		if (!this.lead || !this.lead._id) {
			return result;
		}
		result = `Edit Lead -  ${this.lead.name} - (${this.lead.status})`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.leadForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.leadForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.lead._id) {
			console.log('lead has an Id');
			let editedLead = this.leadForm.value;
			console.log('lead to send', editedLead);
			this.updateLead(editedLead);
			return;
		}
		this.addLead(this.leadForm.value);
	}

	initLeadForm(lead: any = {}) {
		this.leadForm = this.fb.group({
			title: [lead.title || ''],
			name: [lead.name || '', Validators.required],
			source: [lead.source || '', Validators.required],
			status: [lead.status || '', Validators.required],
			website: [lead.website || ''],
			company: [lead.company || '', Validators.required],
			email: [lead.email || '', Validators.required],
			industry: [lead.industry || ''],
			phone: [lead.phone || '', Validators.required],
			country: [lead.country || 'NG'],
			phone2: [lead.phone2 || ''],
			file: [''],
			address: [lead.address || ''],
			description: [lead.description || ''],
		});
	}

	updateLead(lead) {
		this.loadingSubject.next(true);
		if (this.leadForm.value.country === '') {
			this.leadForm.patchValue({
				country: 'NG'
			});
		}
		let updPayload = new FormData();
		updPayload.append('name', this.leadForm.get('name').value);
		updPayload.append('title', this.leadForm.get('title').value);
		updPayload.append('source', this.leadForm.get('source').value);
		updPayload.append('status', this.leadForm.get('status').value);
		updPayload.append('website', this.leadForm.get('website').value);
		updPayload.append('company', this.leadForm.get('company').value);
		updPayload.append('email', this.leadForm.get('email').value);
		updPayload.append('industry', this.leadForm.get('industry').value);
		updPayload.append('phone', this.leadForm.get('phone').value);
		updPayload.append('country', this.leadForm.get('country').value);
		updPayload.append('phone2', this.leadForm.get('phone2').value);
		updPayload.append('address', this.leadForm.get('address').value);
		updPayload.append('description', this.leadForm.get('description').value);
		if (this.fSelected) {
			updPayload.append('file', this.fSelected, this.fSelected.name);
		}
		this.leadsService.updateLead(updPayload, this.lead._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `New Lead has been Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/leads/leads']);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}
	addLead(_lead: LeadModel, withBack: boolean = false) {
		this.loadingSubject.next(true);
		if (this.leadForm.value.country === '') {
			this.leadForm.patchValue({
				country: 'NG'
			});
		}
		let updPayload = new FormData();
		updPayload.append('name', this.leadForm.get('name').value);
		updPayload.append('title', this.leadForm.get('title').value);
		updPayload.append('source', this.leadForm.get('source').value);
		updPayload.append('status', this.leadForm.get('status').value);
		updPayload.append('website', this.leadForm.get('website').value);
		updPayload.append('company', this.leadForm.get('company').value);
		updPayload.append('email', this.leadForm.get('email').value);
		updPayload.append('industry', this.leadForm.get('industry').value);
		updPayload.append('phone', this.leadForm.get('phone').value);
		updPayload.append('country', this.leadForm.get('country').value);
		updPayload.append('phone2', this.leadForm.get('phone2').value);
		updPayload.append('address', this.leadForm.get('address').value);
		updPayload.append('description', this.leadForm.get('description').value);
		if (this.fSelected) {
			updPayload.append('file', this.fSelected, this.fSelected.name);
		}
		this.leadsService.createLead(updPayload).subscribe(
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
		this.lead = Object.assign({}, this.oldLead);
		this.initLeadForm();
		this.hasFormErrors = false;
		this.leadForm.markAsPristine();
		this.leadForm.markAsUntouched();
		this.leadForm.updateValueAndValidity();
	}

	onFileChange(event) {
		if (event.target.files.length > 0) {
			const fileSelected: File = event.target.files[0];
			this.fSelected = fileSelected;
			this.fileName = fileSelected.name;
		}
	}

	toggleInstruction() {
		this.switchInstruction = !this.switchInstruction;
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
