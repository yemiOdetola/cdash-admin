import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetsService } from '../../../../../core/assets';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { UserService } from '../../../../../core/users';

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
	showReccurentMonth = false;
	showReccurentYear = false;
	showHistorical = false;
	editAssetInit = false;
	assetName = '';
	staffs = [];
	constructor(
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private assetsService: AssetsService,
		private layoutUtilsService: LayoutUtilsService,
		private usersService: UserService,
		private router: Router) { }

	ngOnInit() {
		this.getAllStaffs();
		console.clear();
		let group = {};
		this.localFields.forEach(input_template => {
			group[input_template.id] = new FormControl('');
		});
		this.localFields.forEach(field => {
			if (field.id === 'recurrent_expenditure_year') {
				this.showReccurentYear = true;
			}
			if (field.id === 'recurrent_expenditure_month') {
				this.showReccurentMonth = true;
			}
			if (field.id === 'historical_cost') {
				this.showHistorical = true;
			}
		});
		this.dataFormGroup = new FormGroup(group);
		this.loading$ = this.loadingSubject.asObservable();
		this.assetId = this.route.snapshot.params['id'];
		this.emptyReccurentForm();
		this.emptyReccurentMonthForm();
		this.emptyHistoricalCost();
	}

	getAllStaffs() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.usersService.getStaffs(0, 999).subscribe(
			response => {
				this.staffs = response['data'];
				this.loadingSubject.next(false);
				console.log('all staffs returned', this.staffs);
			},
			error => {
				console.log('error', error);
			}
		);
	}

	selectMenu(item) {
		return this.selected = item;
	}

	emptyReccurentForm() {
		this.reccurentFormGroup = this.fb.group({
			currency: ['' || 'naira'],
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
			currency: ['' || 'naira'],
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
			currency: ['' || 'naira'],
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
		if (this.editAssetInit) {
			console.log('lead has an Id');
			let editedAsset = this.dataFormGroup.value;
			console.log('lead to send', editedAsset);
			this.updateAssetMainData(editedAsset);
			return;
		}
		this.addAssetMainData();
	}

	addAssetMainData() {
		this.loadingSubject.next(true);
		let payload = new FormData();
		let forms = this.dataFormGroup.value;
		for (let key in forms) {
			payload.append(key, forms[key]);
		}
		if (this.fSelectedIcon) {
			payload.append('icon', this.fSelectedIcon, this.fSelectedIcon.name);
		}
		if (this.fSelectedIndustrial) {
			payload.append('industrial_link', this.fSelectedIndustrial, this.fSelectedIndustrial.name);
		}
		if (this.fSelectedLocation) {
			payload.append('location_of_deployment_image', this.fSelectedLocation, this.fSelectedLocation.name);
		}
		if (this.fSelectedSchematics) {
			payload.append('diagram_schematics', this.fSelectedSchematics, this.fSelectedSchematics.name);
		}
		payload.append('name', this.assetName);
		payload.append('asset_id', this.assetId);
		console.log(this.assetName);
		this.assetsService.createAssetData(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				this.reset();
				const message = `Asset been successfully added`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				if (data.status === true && this.showReccurentYear) {
					this.selected = 'reccurent_year';
				} else if (data.status === true && this.showReccurentMonth) {
					this.selected = 'reccurent_month';
				} else if (data.status === true && this.showHistorical) {
					this.selected = 'historical_cost';
				} else {
					this.router.navigate([`/cdash/assets/data/${this.assetId}`]);
				}
				localStorage.setItem('asset_data_id', data.data._id);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	addReccurentYear(formName) {
		this.loadingSubject.next(true);
		const formData = [
			{
				year: 2012,
				amount: this.reccurentFormGroup.get('year12').value
			},
			{
				year: 2013,
				amount: this.reccurentFormGroup.get('year13').value
			},
			{
				year: 2014,
				amount: this.reccurentFormGroup.get('year14').value
			},
			{
				year: 2015,
				amount: this.reccurentFormGroup.get('year15').value
			},
			{
				year: 2016,
				amount: this.reccurentFormGroup.get('year16').value
			},
			{
				year: 2017,
				amount: this.reccurentFormGroup.get('year17').value
			},
			{
				year: 2018,
				amount: this.reccurentFormGroup.get('year18').value
			},
			{
				year: 2019,
				amount: this.reccurentFormGroup.get('year19').value
			},
		];
		const payload = {
			data: formData,
			type: formName,
			currency: this.reccurentFormGroup.get('currency').value,
			asset_data_id: localStorage.getItem('asset_data_id'),
		};
		this.assetsService.addCharts(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				const message = `Asset chart been successfully updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				if (data.status === true && this.showReccurentMonth) {
					this.selected = 'reccurent_month';
				} else if (data.status === true && this.showHistorical) {
					this.selected = 'historical_cost';
				} else {
					this.router.navigate([`/cdash/assets/data/${this.assetId}`]);
				}
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	addReccurentMonth(formName) {
		this.loadingSubject.next(true);
		const formData = [
			{
				month: 'january',
				amount: this.reccurentMonthFormGroup.get('january').value
			},
			{
				month: 'february',
				amount: this.reccurentMonthFormGroup.get('february').value
			},
			{
				month: 'march',
				amount: this.reccurentMonthFormGroup.get('march').value
			},
			{
				month: 'april',
				amount: this.reccurentMonthFormGroup.get('april').value
			},
			{
				month: 'may',
				amount: this.reccurentMonthFormGroup.get('may').value
			},
			{
				month: 'june',
				amount: this.reccurentMonthFormGroup.get('june').value
			},
			{
				month: 'july',
				amount: this.reccurentMonthFormGroup.get('july').value
			},
			{
				month: 'august',
				amount: this.reccurentMonthFormGroup.get('august').value
			},
			{
				month: 'september',
				amount: this.reccurentMonthFormGroup.get('september').value
			},
			{
				month: 'october',
				amount: this.reccurentMonthFormGroup.get('october').value
			},
			{
				month: 'november',
				amount: this.reccurentMonthFormGroup.get('november').value
			},
			{
				month: 'december',
				amount: this.reccurentMonthFormGroup.get('december').value
			},
		];
		const payload = {
			data: formData,
			type: formName,
			currency: this.reccurentMonthFormGroup.get('currency').value,
			asset_data_id: localStorage.getItem('asset_data_id'),
		};
		this.assetsService.addCharts(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				const message = `Asset chart been successfully updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				if (data.status === true && this.showHistorical) {
					this.selected = 'historical_cost';
				}
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	addHistoricalCost(formName) {
		this.loadingSubject.next(true);
		const formData = [
			{
				year: 2012,
				amount: this.historicalFormGroup.get('year12').value
			},
			{
				year: 2013,
				amount: this.historicalFormGroup.get('year13').value
			},
			{
				year: 2014,
				amount: this.historicalFormGroup.get('year14').value
			},
			{
				year: 2015,
				amount: this.historicalFormGroup.get('year15').value
			},
			{
				year: 2016,
				amount: this.historicalFormGroup.get('year16').value
			},
			{
				year: 2017,
				amount: this.historicalFormGroup.get('year17').value
			},
			{
				year: 2018,
				amount: this.historicalFormGroup.get('year18').value
			},
			{
				year: 2019,
				amount: this.historicalFormGroup.get('year19').value
			},
		];
		const payload = {
			data: formData,
			type: formName,
			currency: this.historicalFormGroup.get('currency').value,
			asset_data_id: localStorage.getItem('asset_data_id'),
		};
		this.assetsService.addCharts(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				const message = `Asset chart been successfully updated`;
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

	updateAssetMainData(assetData) {
		this.assetsService.updateAssetData(assetData, this.assetId).subscribe(
			data => {
				this.loadingSubject.next(false);
				const message = `Asset been successfully updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				if (data.status === true && this.showReccurentYear) {
					this.selected = 'reccurent_year';
				} else if (data.status === true && this.showReccurentMonth) {
					this.selected = 'reccurent_month';
				} else if (data.status === true && this.showHistorical) {
					this.selected = 'historical_cost';
				}
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
			if (event.target.files.length > 0) {
				this.fSelectedSchematics = event.target.files[0];
				console.log('on diagram schematics', this.fSelectedSchematics);
				this.fileNameSchematics = event.target.files[0].name;
			}
		}
		if (type === 'industrial_link') {
			if (event.target.files.length > 0) {
				this.fSelectedIndustrial = event.target.files[0];
				this.fileNameIndustrial = event.target.files[0].name;
				console.log('on diagram schematics', this.fSelectedIndustrial);
			}
		}
		if (type === 'location_of_deployment_image') {
			if (event.target.files.length > 0) {
				this.fSelectedLocation = event.target.files[0];
				this.fileNameLocation = event.target.files[0].name;
				console.log('on diagram schematics', this.fSelectedLocation);
			}
		}
		if (type === 'icon') {
			if (event.target.files.length > 0) {
				this.fSelectedIcon = event.target.files[0];
				this.fileNameIcon = event.target.files[0].name;
				console.log('on diagram schematics', this.fSelectedIcon);
			}
		}
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() { }
}
