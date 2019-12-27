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
// recurrent_month
// recurrent_expenditure_year
// historical_data
export class AssetDataComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	assetDataId: string;
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
	formMap: any;
	myForms: any;
	myformsName: any;
	sForm;
	formTypes;
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
		this.formMap = {};
		this.myForms = [];
		this.myformsName = [];
		this.localFields.forEach(input_template => {
			group[input_template.id] = new FormControl('');
		});
		this.dataFormGroup = new FormGroup(group);
		console.log('data form groupp', this.dataFormGroup);
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
		this.loading$ = this.loadingSubject.asObservable();
		this.assetDataId = this.route.snapshot.params['id'];
		if (this.assetDataId) {
			this.getAssetDetails();
		}
		this.emptyReccurentForm();
		this.emptyReccurentMonthForm();
		this.emptyHistoricalCost();
	}
	getAssetDetails() {
		this.loadingSubject.next(true);
		this.assetsService.getAssetDataById(this.assetDataId).subscribe(
			singleAsset => {
				this.assetDetails = singleAsset['data'];
				console.log('this assetdata details oninit', this.assetDetails);
				this.dataFormGroup.patchValue(this.assetDetails);
				this.assetName = this.assetDetails.name;
				if (this.assetDetails.historical_data.length) {
					this.initHistoricalCost(this.assetDetails.historical_data);
				}
				if (this.assetDetails.recurrent_month.length) {
					this.initReccurentMonthForm(this.assetDetails.recurrent_month);
				}
				if (this.assetDetails.recurrent_year.length) {
					this.initReccurentForm(this.assetDetails.recurrent_year);
				}
				this.editAssetInit = true;
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
	}
	getAllStaffs() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.usersService.getStaffs(0, 999).subscribe(
			response => {
				this.staffs = response['data'];
				this.formTypes = response['data'];
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

	initReccurentForm(reccurentData) {
		this.reccurentFormGroup = this.fb.group({
			currency: ['' || 'naira'],
			year12: [reccurentData[0].amount || ''],
			year13: [reccurentData[1].amount || ''],
			year14: [reccurentData[2].amount || ''],
			year15: [reccurentData[3].amount || ''],
			year16: [reccurentData[4].amount || ''],
			year17: [reccurentData[5].amount || ''],
			year18: [reccurentData[6].amount || ''],
			year19: [reccurentData[7].amount || ''],
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

	initHistoricalCost(historicalData) {
		this.reccurentFormGroup = this.fb.group({
			currency: ['' || 'naira'],
			year12: [historicalData[0].amount || ''],
			year13: [historicalData[1].amount || ''],
			year14: [historicalData[2].amount || ''],
			year15: [historicalData[3].amount || ''],
			year16: [historicalData[4].amount || ''],
			year17: [historicalData[5].amount || ''],
			year18: [historicalData[6].amount || ''],
			year19: [historicalData[7].amount || ''],
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


	initReccurentMonthForm(reccurentData) {
		this.reccurentMonthFormGroup = this.fb.group({
			currency: [reccurentData[0].currency || 'naira'],
			january: [reccurentData[1].january || ''],
			february: [reccurentData[2].february || ''],
			march: [reccurentData[3].march || ''],
			april: [reccurentData[4].april || ''],
			may: [reccurentData[5].may || ''],
			june: [reccurentData[6].june || ''],
			july: [reccurentData[7].july || ''],
			august: [reccurentData[8].august || ''],
			september: [reccurentData[9].september || ''],
			october: [reccurentData[10].october || ''],
			november: [reccurentData[11].november || ''],
			december: [reccurentData[12].december || ''],
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
			this.updateAssetMainData();
			return;
		}
		this.addAssetMainData();
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
					this.router.navigate([`/cdash/assets/data/${this.localForms._id}`]);
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

	addAssetMainData() {
		this.loadingSubject.next(true);
		let payload = new FormData();
		let forms = this.dataFormGroup.value;
		for (let key in forms) {
			payload.append(key, forms[key]);
		}
		this.dataFormGroup.patchValue({business_owners: this.myForms});
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
		payload.append('asset_id', this.localForms._id);
		console.log('payload', payload);
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
					this.router.navigate([`/cdash/assets/data/${this.localForms._id}`]);
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

	updateAssetMainData() {
		let payload = new FormData();
		let forms = this.dataFormGroup.value;
		for (let key in forms) {
			payload.append(key, forms[key]);
		}
		this.dataFormGroup.patchValue({business_owners: this.myForms});
		payload.append('name', this.assetName);
		console.log('payload', payload);
		// payload.append('asset_id', this.localForms._id);
		this.assetsService.updateAssetData(payload, this.assetDataId).subscribe(
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
				} else {
					this.router.navigate([`/cdash/assets/data/${this.localForms._id}`]);
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

	handleFormChange(event) {
		console.log(event.target.value);
		if (event.target.value === '') {
			return;
		}
		this.sForm = event.target.value;
		this.formPush();
	}

	formPush() {
		if (this.formMap[this.sForm] === undefined || this.formMap[this.sForm] === false) {
			for (let i = 0; i < this.formTypes.length; i++) {
				if (this.formTypes[i]._id === this.sForm) {
					this.myformsName.push(this.formTypes[i]);
					this.myForms.push(this.formTypes[i]._id);
				}
			}
			this.formMap[this.sForm] = true;
		}
		console.log('myforms', this.myForms);
		console.log('myforms', this.myformsName);
	}

	formRemove(form) {
		console.log('form', form);
		for (let i = 0; i < this.myForms.length; i++) {
			if (this.myForms[i].id === form.id) {
				console.log(form.id);
				this.myForms.splice(i, 1);
			}
		}
		for (let i = 0; i < this.myformsName.length; i++) {
			if (this.myformsName[i].id === form.id) {
				console.log(form.id);
				this.myformsName.splice(i, 1);
			}
		}
	}

	ngOnDestroy() { }
}
