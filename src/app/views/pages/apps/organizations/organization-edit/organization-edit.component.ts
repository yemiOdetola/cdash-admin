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
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.emptyOrganizationForm();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getOrganizationDetails().subscribe(organizationData => this.initOrganizationForm(organizationData));
			this.loadingSubject.next(true);
		} else {
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.organizationForm.value);
		console.log('form control', this.organizationForm.controls);
	}

	getOrganizationDetails() {
		return this.organizationsService.getOrganizationById(this.idParams).pipe(
			map(organizationDetails => {
				this.organization = organizationDetails['success'];
				this.loadingSubject.next(false);
				console.log('retrieving organizations with pipe', this.organization);
				return this.organization;
			})
		);
	}

	emptyOrganizationForm() {
		this.organizationForm = this.fb.group({
			name: ['', Validators.required],
			email: ['', Validators.required],
			address: ['', Validators.required],
			url: ['', Validators.required],
			rc: ['', Validators.required],
			color: [''],
		});
	}
	initOrganizationForm(organization: any = {}) {
		this.organizationForm = this.fb.group({
			name: [organization.name || '', Validators.required],
			email: [organization.email || '', Validators.required],
			url: [organization.url || '', Validators.required],
			address: [organization.address || '', Validators.required],
			rc: [organization.rc || '', Validators.required],
			color: [organization.color || '']
		});
	}

	getComponentTitle() {
		let result = 'Create Organization';
		if (!this.organization || !this.organization._id) {
			return result;
		}
		result = `Edit Organization`;
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
		if (this.organization && this.organization._id) {
			let editedOrganization = this.organizationForm.value;
			console.log('Organization to send', editedOrganization);
			this.updateOrganization(editedOrganization);
			return;
		}
		this.addOrganization(this.organizationForm.value);
	}

	updateOrganization(organization) {
		this.loadingSubject.next(true);
		let updPayload = new FormData();
		updPayload.append('name', this.organizationForm.get('name').value);
		updPayload.append('email', this.organizationForm.get('email').value);
		updPayload.append('address', this.organizationForm.get('address').value);
		updPayload.append('url', this.organizationForm.get('url').value);
		updPayload.append('rc', this.organizationForm.get('rc').value);
		updPayload.append('color', this.organizationForm.get('color').value);
		if (this.fSelected) {
			updPayload.append('file', this.fSelected, this.fSelected.name);
		}
		this.organizationsService.updateOrganization(updPayload, this.organization._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Organization has been Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/organizations/organizations']);
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
		updPayload.append('email', this.organizationForm.get('email').value);
		updPayload.append('address', this.organizationForm.get('address').value);
		updPayload.append('url', this.organizationForm.get('url').value);
		updPayload.append('rc', this.organizationForm.get('rc').value);
		updPayload.append('color', this.organizationForm.get('color').value);
		if (this.fSelected) {
			updPayload.append('file', this.fSelected, this.fSelected.name);
		}
		this.organizationsService.createOrganization(updPayload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `Organization has been successfully created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/organizations/organizations']);
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
			const fileSelected: File = event.target.files[0];
			this.fSelected = fileSelected;
			this.fileName = fileSelected.name;
		}
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() { }

}
