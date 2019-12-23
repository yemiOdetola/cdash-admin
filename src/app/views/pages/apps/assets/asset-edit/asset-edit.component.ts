// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { AssetModel, AssetsService } from '../../../../../core/assets';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';

// imprts for date hiccup
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports

const moment = _moment;

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-asset-edit',
	templateUrl: './asset-edit.component.html',
	styleUrls: ['./asset-edit.component.scss'],
	providers: [
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
	],
})
export class AssetEditComponent implements OnInit, OnDestroy {
	asset: AssetModel;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldAsset: AssetModel;
	assetForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	selectedFile: File = null;
	idParams: string;
	fSelected;
	fileName = '';
	required = ['true', 'false'];
	form = [];
	constructor(

		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private assetsService: AssetsService
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.loadingSubject.next(true);
		} else {
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.assetForm.value);
		console.log('form control', this.assetForm.controls);
	}

	getAssetDetails() {
		return this.assetsService.getAssetById(this.idParams).pipe(
			map(assetDetails => {
				this.asset = assetDetails['success'];
				this.loadingSubject.next(false);
				console.log('retrieving assets with pipe', this.asset);
				return this.asset;
			})
		);
	}

	getComponentTitle() {
		let result = 'Create Asset form';
		if (!this.asset || !this.asset._id) {
			return result;
		}
		result = `Edit Asset form -  ${this.asset.name}`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.assetForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.assetForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.asset && this.asset._id) {
			console.log('lead has an Id');
			let editedAsset = this.assetForm.value;
			console.log('Asset to send', editedAsset);
			this.updateAsset(editedAsset);
			return;
		}
		this.addAsset(this.assetForm.value);
	}

	updateAsset(asset) {
		const convertedStart: any = moment(asset.start).valueOf();
		const convertedEnd: any = moment(asset.end).valueOf();
		let updPayload = new FormData();
		updPayload.append('name', this.assetForm.get('name').value);
		// updPayload.append('description', this.assetForm.get('description').value);
		updPayload.append('start', convertedStart);
		updPayload.append('end', convertedEnd);
		updPayload.append('file', this.fSelected, this.fSelected.name);
		this.assetsService.updateAsset(updPayload, this.asset._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `New Asset has been Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/assets/assets']);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	addAsset(_asset: AssetModel) {
		this.loadingSubject.next(true);
		let prepStart = new Date(_asset.start);
		let prepEnd = new Date(_asset.end);
		const convertedStart: any = prepStart.getTime();
		const convertedEnd: any = prepEnd.getTime();
		let updPayload = new FormData();
		updPayload.append('name', this.assetForm.get('name').value);
		updPayload.append('start', convertedStart);
		updPayload.append('end', convertedEnd);
		updPayload.append('file', this.fSelected, this.fSelected.name);
		this.assetsService.createAsset(updPayload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `New Asset has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/assets/assets']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
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
