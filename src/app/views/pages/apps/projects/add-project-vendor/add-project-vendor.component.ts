// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { ProjectVendorModel, ProjectsService } from '../../../../../core/projects';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-add-project-vendor',
	templateUrl: './add-project-vendor.component.html',
	styleUrls: ['./add-project-vendor.component.scss']
})
export class AddProjectVendorComponent implements OnInit, OnDestroy {
	projectVendor: ProjectVendorModel;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	projectVendorForm: FormGroup;
	oldProjectVendor: ProjectVendorModel;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	vendors = [];
	idParams: string = '';
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private projectsService: ProjectsService
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.initAddVendorForm();
		this.getVendors();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		this.projectVendor = this.projectVendorForm.value;
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.projectVendorForm.value);
		console.log('form control', this.projectVendorForm.controls);
	}

	getVendors() {
		this.projectsService.getVendors().subscribe(
			myvendors => {
				this.vendors = myvendors['success'];
				console.log('vendors', this.vendors);
				this.loadingSubject.next(false);
			}
		);
	}

	initAddVendorForm(project: any = {}) {
		this.projectVendorForm = this.fb.group({
			vendor: ['', Validators.required]
		});
	}

	getComponentTitle() {
		let result = `Add New Vendor to Project`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.projectVendorForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.projectVendorForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		this.addVendor(this.projectVendorForm.value);
	}
	/**
	 * Add AddUser
	 *
	 * @param _vendor: AddUserModel
	 * @param withBack: boolean
	 */
	addVendor(_vendor) {
		let payload = {};
		this.loadingSubject.next(true);
		const project_id = this.idParams;
		const name = _vendor.vendor;
		let goods = [];
		let vendor_id = '';
		this.vendors.forEach(vendor => {
			if (vendor.name === name) {
				vendor_id = vendor._id;
				goods = vendor.goods;
			}
		});
		payload = {...payload, project_id, vendor_id, name, goods};
		console.log(payload);
		this.projectsService.addVendorToProject(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `Successfully Added`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate([`/strada/projects/project/${this.idParams}`]);
			}, error => {
				if (error.error.error === 'Error: Duplicate Project User') {
					this.layoutUtilsService.showActionNotification('This Vendor has already been added!', MessageType.Create, 10000, true, true);
				}
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	reset() {
		this.projectVendor = Object.assign({}, this.oldProjectVendor);
		this.initAddVendorForm();
		this.hasFormErrors = false;
		this.projectVendorForm.markAsPristine();
		this.projectVendorForm.markAsUntouched();
		this.projectVendorForm.updateValueAndValidity();
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
