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
	pageTitle = 'Asset form';
	hasFormErrors = false;
	fSelectedIcon;
	fSelectedLocation;
	fSelectedIndustrial;
	fSelectedSchematics;
	fileNameIcon;
	fileNameLocation;
	fileNameIndustrial;
	fileNameSchematics;
	oldAssetData: FormGroup;
	assetData: any;
	formFields = [];
	localForms = JSON.parse(localStorage.getItem('formElement'));
	localFields = this.localForms.form;
	forms: any = this.localFields;
	dataFormGroup: FormGroup;
	reccurentFormGroup: FormGroup;
	reccurentMonthFormGroup: FormGroup;
	historicalFormGroup: FormGroup;
	selected = 'main_form';
	constructor(
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private assetsService: AssetsService,
		private layoutUtilsService: LayoutUtilsService,
		private _location: Location,
		private router: Router) { }

	ngOnInit() {
		console.clear();
		let group = {};
		this.localFields.forEach(input_template => {
			group[input_template.id] = new FormControl('');
		});
		this.dataFormGroup = new FormGroup(group);
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.assetId = this.route.snapshot.params['id'];
		this.emptyReccurentForm();
		this.emptyReccurentMonthForm();
		this.emptyHistoricalCost();
	}

	selectMenu(item) {
		return this.selected = item;
	}

	initReccurentForm(turnover) {
		this.reccurentFormGroup = this.fb.group({
			year12: [turnover[0].turnover || ''],
			year13: [turnover[1].turnover || ''],
			year14: [turnover[2].turnover || ''],
			year15: [turnover[3].turnover || ''],
			year16: [turnover[4].turnover || ''],
			year17: [turnover[5].turnover || ''],
			year18: [turnover[6].turnover || ''],
			year19: [turnover[7].turnover || ''],
		});
	}

	emptyReccurentForm() {
		this.reccurentFormGroup = this.fb.group({
			year12: [''],
			year13: [''],
			year14: [''],
			year15: [''],
			year16: [''],
			year17: [''],
			year18: [''],
			year19: [''],
		});
	}

	emptyHistoricalCost() {
		this.historicalFormGroup = this.fb.group({
			year12: [''],
			year13: [''],
			year14: [''],
			year15: [''],
			year16: [''],
			year17: [''],
			year18: [''],
			year19: [''],
		});
	}

	emptyReccurentMonthForm() {
		this.reccurentMonthFormGroup = this.fb.group({
			january: [''],
			february: [''],
			march: [''],
			april: [''],
			may: [''],
			june: [''],
			july: [''],
			august: [''],
			september: [''],
			october: [''],
			november: [''],
			december: [''],
		});
	}


	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.dataFormGroup.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.dataFormGroup.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			return;
		}
		if (this.assetData._id) {
			console.log('lead has an Id');
			let editedAsset = this.dataFormGroup.value;
			console.log('lead to send', editedAsset);
			this.updateAssetData(editedAsset);
			return;
		}
		this.addAssetData(this.dataFormGroup.value);
	}

	addAssetData(assetData) {
		this.assetsService.createAssetData(assetData).subscribe(
			data => {
				this.loadingSubject.next(false);
				const message = `Asset been successfully added`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/cdash/assets/assets']);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	updateAssetData(assetData) {
		this.assetsService.updateAssetData(assetData, this.assetId).subscribe(
			data => {
				this.loadingSubject.next(false);
				const message = `Asset been successfully updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/cdash/assets/assets']);
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
		this.assetData = Object.assign({}, this.oldAssetData);
		// this.initAssetForm();
		this.hasFormErrors = false;
		this.dataFormGroup.markAsPristine();
		this.dataFormGroup.markAsUntouched();
		this.dataFormGroup.updateValueAndValidity();
	}

	onFileChange(event, type) {
		if (type === 'diagram_schematics') {
			console.log('on diagram schematics', event.target.files[0]);
			if (event.target.files.length > 0) {
				this.fSelectedSchematics = event.target.files[0];
				this.fileNameSchematics = event.target.files[0].name;
			}
		}
		if (type === 'industrial_link') {
			console.log('on industrial link', event.target.files[0]);
			if (event.target.files.length > 0) {
				this.fSelectedIndustrial = event.target.files[0];
				this.fileNameIndustrial = event.target.files[0].name;
			}
		}
		if (type === 'location_of_deployment_image') {
			console.log('on location_of_deployment_image', event.target.files[0]);
			if (event.target.files.length > 0) {
				this.fSelectedLocation = event.target.files[0];
				this.fileNameLocation = event.target.files[0].name;
			}
		}
		if (type === 'icon') {
			console.log('on icon', event.target.files[0]);
			if (event.target.files.length > 0) {
				this.fSelectedIcon = event.target.files[0];
				this.fileNameIcon = event.target.files[0].name;
			}
		}
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() { }
}
