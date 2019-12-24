// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { OrganizationModel, OrganizationsService } from '../../../../../core/organizations';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { tap, map } from 'rxjs/operators';

// imprts for date hiccup
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports

const moment = _moment;

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-organization-edit',
	templateUrl: './organization-edit.component.html',
	styleUrls: ['./organization-edit.component.scss'],
	providers: [
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
	],
})
export class OrganizationEditComponent implements OnInit, OnDestroy {
	organization: OrganizationModel;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldOrganization: OrganizationModel;
	organizationForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	selectedFile: File = null;
	idParams: string;
	showModal: boolean = false;
	fSelected;
	fileName;
	formError = 'Oops! Change a few things up and try submitting again.';
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private fb: FormBuilder,
		private organizationsService: OrganizationsService,
	) { }

	ngOnInit() {
		console.log('init component');
		this.emptyOrganizationForm();
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.getOrganizationDetails();
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
	}

	getOrganizationDetails() {
		console.log('start gettting org detail');
		this.organizationsService.getOrganization().subscribe(organizationDetails => {
			console.log('organization details full', organizationDetails);
			this.organization = organizationDetails['data'];
			const organizationData = organizationDetails['data'];
			this.initOrganizationForm(organizationData);
			this.loadingSubject.next(false);
			return this.organization;
		});
	}

	emptyOrganizationForm() {
		this.organizationForm = this.fb.group({
			name: ['', Validators.required],
			address: ['', Validators.required],
			color: [''],
		});
	}
	initOrganizationForm(organization: any = {}) {
		this.organizationForm = this.fb.group({
			name: [organization.name || '', Validators.required],
			address: [organization.address || '', Validators.required],
			color: [organization.color || '']
		});
	}

	getComponentTitle() {
		const result = `Edit Organization`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.organizationForm.controls;
		this.loadingSubject.next(true);
		if (this.organizationForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
			let editedOrganization = this.organizationForm.value;
			console.log('Organization to send', editedOrganization);
			this.updateOrganization();
			return;
	}

	updateOrganization() {
		this.loadingSubject.next(true);
		let updPayload = new FormData();
		updPayload.append('name', this.organizationForm.get('name').value);
		updPayload.append('address', this.organizationForm.get('address').value);
		updPayload.append('color', this.organizationForm.get('color').value);
		if (this.fSelected) {
			updPayload.append('logo', this.fSelected, this.fSelected.name);
		}
		this.organizationsService.updateOrganization(updPayload).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Organization has been Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/cdash/organizations/organization']);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	addOrganization(_organization: OrganizationModel, withBack: boolean = false) {
		this.loadingSubject.next(true);
		let updPayload = new FormData();
		updPayload.append('name', this.organizationForm.get('name').value);
		updPayload.append('address', this.organizationForm.get('address').value);
		updPayload.append('color', this.organizationForm.get('color').value);
		if (this.fSelected) {
			updPayload.append('logo', this.fSelected, this.fSelected.name);
		}
		this.organizationsService.createOrganization(updPayload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `Success`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/cdash/organization/organizations']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	reset() {
		this.organization = Object.assign({}, this.oldOrganization);
		this.emptyOrganizationForm();
		this.hasFormErrors = false;
		this.organizationForm.markAsPristine();
		this.organizationForm.markAsUntouched();
		this.organizationForm.updateValueAndValidity();
	}

	onFileChange(event) {
		if (event.target.files.length > 0) {
			this.fSelected = event.target.files[0];
			this.fileName = event.target.files[0].name;
		}
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() { }

}
