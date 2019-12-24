import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetsService } from '../../../../../core/assets';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
	selector: 'kt-asset-data',
	templateUrl: './asset-data.component.html',
	styleUrls: ['./asset-data.component.scss']
})
export class AssetDataComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	assetId: string;
	assetDetails: any;
	pageTitle = 'Please wait...';
	hasFormErrors = false;
	fSelected;
	fileName;
	assetDataForm: FormGroup;
	oldAssetData: FormGroup;
	assetData: any;
	formFields = [];
	dataFormGroup: FormGroup;
	constructor(
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private assetsService: AssetsService,
		private layoutUtilsService: LayoutUtilsService,
		private _location: Location,
		private router: Router) { }

	ngOnInit() {
		let formItems = JSON.parse(localStorage.getItem('formElement'));
		let group = {};
		let formsForm = formItems['form'];
		formsForm.forEach(inputElement => {
			group[inputElement.label] = new FormControl('');
		});
		this.dataFormGroup = new FormGroup(group);
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.assetId = this.route.snapshot.params['id'];
		// this.assetsService.getAssetById(this.assetId).subscribe(
		// 	assetForm => {
		// 		this.assetData = assetForm['data'];
		// 		this.formFields = this.assetData.form;
		// 		let formItems = this.assetData.form;
		// 		formItems.forEach(inputElement => {
		// 			group[inputElement.label] = new FormControl('');
		// 		});
		// 		this.dataFormGroup = new FormGroup(group);
		// 		this.loadingSubject.next(false);
		// 		this.pageTitle = `${this.assetData.name}`;
		// 	},
		// 	error => {
		// 		console.log('error occured', error);
		// 		this.loadingSubject.next(false);
		// 	}
		// );
		console.log('id returned', this.route.snapshot.params['id']);
	}

	initAssetForm() { }


	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.assetDataForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.assetDataForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			return;
		}
		if (this.assetData._id) {
			console.log('lead has an Id');
			let editedLead = this.assetDataForm.value;
			console.log('lead to send', editedLead);
			this.updateAssetData(editedLead);
			return;
		}
		this.addAssetData(this.assetDataForm.value);
	}

	updateAssetData(assetData) { }
	addAssetData(assetData) { }


	reset() {
		this.assetData = Object.assign({}, this.oldAssetData);
		this.initAssetForm();
		this.hasFormErrors = false;
		this.assetDataForm.markAsPristine();
		this.assetDataForm.markAsUntouched();
		this.assetDataForm.updateValueAndValidity();
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
