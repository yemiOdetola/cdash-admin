// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { VendorModel, VendorsService } from '../../../../../core/vendors';
import * as countries from './countries.json';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-vendor-edit',
	templateUrl: './vendor-edit.component.html',
	styleUrls: ['./vendor-edit.component.scss']
})
export class VendorEditComponent implements OnInit, OnDestroy {
	vendor: VendorModel;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldCVendor: VendorModel;
	vendorForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	objectKeys = Object.keys;
	county;
	countriesObj = countries;
	selectedTab: number = 0;
	selectedFile: File = null;
	idParams: string;
	good: string;
	goods = [];
	fSelected;
	fileName = '';
	switchInstruction = true;
	titles = ['Mrs.', 'Mr.', 'Dr.', 'Miss'];
	ratings = ['pending', 'invoice', 'ready', 'commited', 'scammer'];
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
		private vendorsService: VendorsService
	) {
		this.county = Object.keys(this.countriesObj);
	}

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		console.log('VendorEditComponent initiated');
		this.initVendorForm();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getVendorDetails().subscribe(vendorData => this.initVendorForm(vendorData));
			this.loadingSubject.next(true);
		} else {
			this.vendor = this.vendorForm.value;
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.vendorForm.value);
		console.log('form control', this.vendorForm.controls);
	}

	getVendorDetails() {
		return this.vendorsService.getVendorById(this.idParams).pipe(
			map(vendorDetails => {
				this.vendor = vendorDetails['success'];
				this.goods = this.vendor.goods;
				this.loadingSubject.next(false);
				console.log('retrieving vendor with pipe', this.vendor);
				return this.vendor;
			})
		);
	}

	initVendorForm(vendor: any = {}) {
		let convertedGoods = '';
		if (vendor.goods) {
			convertedGoods = vendor.goods.toString();
		}
		this.vendorForm = this.fb.group({
			title: [vendor.title || ''],
			name: [vendor.name || '', Validators.required],
			address: [vendor.address || '', Validators.required],
			industry: [vendor.industry || '', Validators.required],
			goods: [convertedGoods || '', Validators.required],
			country: [vendor.country || 'NG'],
			phone: [vendor.phone || '', Validators.required],
			phone2: [vendor.phone2 || ''],
			website: [vendor.website || ''],
			description: [vendor.description || ''],
			email: [vendor.email || '', Validators.required],
			file: [''],
		});
	}

	getComponentTitle() {
		let result = 'Please Wait';
		if (!this.vendor || !this.vendor._id) {
			result = 'Create New Vendor';
			return result;
		}
		result = `Edit Vendor -  ${this.vendor.name}`;
		return result;
	}

	onSubmit() {
		this.vendorForm.patchValue({
			goods: this.goods
		});
		this.hasFormErrors = false;
		const controls = this.vendorForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.vendorForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.vendor._id) {
			console.log('Vendor has an Id');
			let editedVendor = this.vendorForm.value;
			console.log('Vendor to send', editedVendor);
			this.updateVendor(editedVendor);
			return;
		}
		this.addVendor(this.vendorForm.value);
	}

	updateVendor(vendor) {
		if (this.vendorForm.value.country === '') {
			this.vendorForm.patchValue({
				country: 'NG'
			});
		}
		let updPayload = new FormData();
		updPayload.append('name', this.vendorForm.get('name').value);
		updPayload.append('title', this.vendorForm.get('title').value);
		updPayload.append('address', this.vendorForm.get('address').value);
		updPayload.append('industry', this.vendorForm.get('industry').value);
		updPayload.append('goods', JSON.stringify(this.goods));
		updPayload.append('country', this.vendorForm.get('country').value);
		updPayload.append('phone', this.vendorForm.get('phone').value);
		updPayload.append('phone2', this.vendorForm.get('phone2').value);
		updPayload.append('website', this.vendorForm.get('website').value);
		updPayload.append('description', this.vendorForm.get('description').value);
		updPayload.append('email', this.vendorForm.get('email').value);
		if (this.fSelected) {
			updPayload.append('file', this.fSelected, this.fSelected.name);
		}
		this.vendorsService.updateVendor(updPayload, this.vendor._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Updated Successfully`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/vendors/vendors']);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	addVendor(_vendor: VendorModel) {
		this.loadingSubject.next(true);
		if (this.vendorForm.value.country === '') {
			this.vendorForm.patchValue({
				country: 'NG'
			});
		}
		let updPayload = new FormData();
		updPayload.append('name', this.vendorForm.get('name').value);
		updPayload.append('title', this.vendorForm.get('title').value);
		updPayload.append('address', this.vendorForm.get('address').value);
		updPayload.append('industry', this.vendorForm.get('industry').value);
		updPayload.append('goods', JSON.stringify(this.goods));
		updPayload.append('country', this.vendorForm.get('country').value);
		updPayload.append('phone', this.vendorForm.get('phone').value);
		updPayload.append('phone2', this.vendorForm.get('phone2').value);
		updPayload.append('website', this.vendorForm.get('website').value);
		updPayload.append('description', this.vendorForm.get('description').value);
		updPayload.append('email', this.vendorForm.get('email').value);
		if (this.fSelected) {
			updPayload.append('file', this.fSelected, this.fSelected.name);
		}
		this.vendorsService.createVendor(updPayload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `Vendor has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/vendors/vendors']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	reset() {
		this.vendor = Object.assign({}, this.oldCVendor);
		this.initVendorForm();
		this.hasFormErrors = false;
		this.vendorForm.markAsPristine();
		this.vendorForm.markAsUntouched();
		this.vendorForm.updateValueAndValidity();
	}

	onFileChange(event) {
		if (event.target.files.length > 0) {
			const fileSelected: File = event.target.files[0];
			this.fSelected = fileSelected;
			this.fileName = fileSelected.name;
			console.log('fileSelected', fileSelected['originFileObj']);
		}
	}

	addNewGood() {
		console.log('pushed', this.good);
		if (this.good === '') {
			return;
		}
		this.goods.push(this.good);
		this.good = '';
		console.log('goods', this.goods);
	}
	removeGood(id) {
		this.goods.splice(id, 1);
		console.log(id);
	}

	/**
	 * Close alert
	 *
	 * @param $event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	toggleInstruction() {
		this.switchInstruction = !this.switchInstruction;
	}

	ngOnDestroy() { }

}
