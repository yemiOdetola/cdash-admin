// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { CampaignModel, CampaignsService } from '../../../../../core/campaigns';
import { LeadsService } from '../../../../../core/leads';
import { CallsService } from '../../../../../core/calls';
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

const moment = _moment;

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-campaign-edit',
	templateUrl: './campaign-edit.component.html',
	styleUrls: ['./campaign-edit.component.scss'],
	providers: [
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
	],
})
export class CampaignEditComponent implements OnInit, OnDestroy {
	campaign: CampaignModel;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldCampaign: CampaignModel;
	campaignForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	selectedFile: File = null;
	idParams: string;
	campaignTypes: any;
	leads = [];
	nairaSign = '₦';
	statuses = ['Planning', 'Running', 'Terminated', 'Inactive', 'Complete'];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private leadsService: LeadsService,
		private callsService: CallsService,
		private campaignsService: CampaignsService
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.callsService.getCampaignTypes().subscribe(
			campaigns => {
				this.campaignTypes = campaigns['success'];
				console.log('campaign types', this.campaignTypes);
			}
		);
		this.campaignsService.getContactsEvery().subscribe(
			responseData => {
				this.leads = responseData['success'];
				console.log('all campaigns returned', this.leads);
			},
			error => {
				console.log('error', error);
			});
		this.emptyCampaignForm();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getCampaignDetails().subscribe(campaignData => this.initCampaignForm(campaignData));
			this.loadingSubject.next(true);
		} else {
			this.campaign = this.campaignForm.value;
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.campaignForm.value);
		console.log('form control', this.campaignForm.controls);
	}

	getCampaignDetails() {
		return this.campaignsService.getCampaignById(this.idParams).pipe(
			map(campaignDetails => {
				this.campaign = campaignDetails['success'];
				this.loadingSubject.next(false);
				console.log('retrieving campaigns with pipe', this.campaign);
				return this.campaign;
			})
		);
	}

	emptyCampaignForm() {
		this.campaignForm = this.fb.group({
			name: ['', Validators.required],
			type: ['', Validators.required],
			type_id: ['', Validators.required],
			lead_id: ['', Validators.required],
			status: ['', Validators.required],
			price: ['', Validators.required],
			start: ['', Validators.required],
			end: ['', Validators.required],
			description: ['', Validators.required],
		});
	}

	initCampaignForm(campaign: any = {}) {
		let startDate = moment(campaign.start).format('YYYY-MM-DD');
		let endDate = moment(campaign.end).format('YYYY-MM-DD');
		this.campaignForm = this.fb.group({
			name: [campaign.name || '', Validators.required],
			status: [campaign.status || '', Validators.required],
			price: [campaign.price || '', Validators.required],
			start: [startDate || '', Validators.required],
			end: [endDate || '', Validators.required],
			type: [campaign.type || ''],
			description: [campaign.description || '', Validators.required],
		});
	}

	getComponentTitle() {
		let result = 'Create Campaign';
		if (!this.campaign || !this.campaign._id) {
			return result;
		}
		result = `Edit Campaign -  ${this.campaign.name}`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.campaignForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		this.campaignTypes.forEach(campaign => {
			if (campaign.name === this.campaignForm.value.type) {
				this.campaignForm.patchValue({
					type_id: campaign._id
				});
				console.log('selected campaign', campaign.name);
			}
		});
		if (this.campaignForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.campaign._id) {
			console.log('Campaign has an Id');
			let editedCampaign = this.campaignForm.value;
			console.log('Campaign to send', editedCampaign);
			this.updateCampaign(editedCampaign);
			return;
		}
		this.addCampaign(this.campaignForm.value);
	}

	updateCampaign(campaign) {
		const start = moment(this.campaignForm.value.start).valueOf();
		const end = moment(this.campaignForm.value.end).valueOf();
		const remixedPayload = {
			name: campaign.name,
			start: start,
			end: end,
			price: campaign.price,
			description: campaign.description,
			status: campaign.status
		};
		this.campaignsService.updateCampaign(remixedPayload, this.campaign._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Campaign has been Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/campaigns/campaigns']);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}
	/**
	 * Add Lead
	 *
	 * @param _lead: LeadModel
	 * @param withBack: boolean
	 */
	addCampaign(_campaign: CampaignModel, withBack: boolean = false) {
		this.campaignForm.patchValue({
			start: moment(this.campaignForm.value.start).valueOf(),
			end: moment(this.campaignForm.value.end).valueOf()
		});
		console.log('_campaign', _campaign);
		console.log('this.campaignForm.value', this.campaignForm.value);
		this.loadingSubject.next(true);
		const payload = this.campaignForm.value;
		console.log(payload);
		this.campaignsService.createCampaign(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `New Campaign has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/campaigns/campaigns']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	reset() {
		this.campaign = Object.assign({}, this.oldCampaign);
		this.initCampaignForm();
		this.hasFormErrors = false;
		this.campaignForm.markAsPristine();
		this.campaignForm.markAsUntouched();
		this.campaignForm.updateValueAndValidity();
	}

	onFileChange(event) {
		let reader = new FileReader();
		if (event.target.files && event.target.files.length) {
			const file = event.target.files[0];
			reader.readAsDataURL(file);
			reader.onload = () => {
				console.log(reader.result);
				//   this.image = reader.result;
				this.campaignForm.patchValue({
					image: reader.result
				});
			};
		}
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
