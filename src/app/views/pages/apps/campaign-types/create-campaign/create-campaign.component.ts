import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { LayoutConfigService } from '../../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { CampaignTypeModel, CampaignsService} from '../../../../../core/campaign-types';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';
@Component({
	selector: 'kt-create-campaign',
	templateUrl: './create-campaign.component.html',
	styleUrls: ['./create-campaign.component.scss'],
})
export class CreateCampaignComponent implements OnInit, OnDestroy {
	campaignType: CampaignTypeModel;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldCampaign: CampaignTypeModel;
	campaignTypeForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	idParams: string;
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private campaignsService: CampaignsService
	) {
	}

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.initCampaignTypeForm();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getCampaignTypeDetails().subscribe(campaignTypeData => this.initCampaignTypeForm(campaignTypeData));
			this.loadingSubject.next(true);
		} else {
			this.campaignType = this.campaignTypeForm.value;
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.campaignTypeForm.value);
		console.log('form control', this.campaignTypeForm.controls);
	}
	// contact
	getCampaignTypeDetails() {
		return this.campaignsService.getCampaignTypeById(this.idParams).pipe(
			map(campaignTypeDetails => {
				this.campaignType = campaignTypeDetails['success'];
				this.loadingSubject.next(false);
				console.log('retrieving call logs with pipe', this.campaignType);
				return this.campaignType;
			})
		);
	}


	initCampaignTypeForm(campaignType: any = {}) {
		this.campaignTypeForm = this.fb.group({
			name: [campaignType.name || '', Validators.required],
			price: [campaignType.price || '', Validators.required],
			description: [campaignType.description || '', Validators.required]
		});
	}

	getComponentTitle() {
		let result = 'Create Campaign Type';
		if (!this.campaignType || !this.campaignType._id) {
			return result;
		}
		result = `Edit Campaign Type - (${this.campaignType.name})`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.campaignTypeForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.campaignTypeForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.campaignType._id) {
			console.log('lead has an Id');
			let editedCampaignType = this.campaignTypeForm.value;
			console.log('campaign type to send', editedCampaignType);
			this.updateCampaignType(editedCampaignType);
			return;
		}
		this.addCampaignType(this.campaignTypeForm.value);
		return;
	}

	updateCampaignType(campaignType) {
		this.campaignsService.updateCampaignType(campaignType, this.campaignType._id).subscribe(
			data => {
				this.loadingSubject.next(false);
				const message = `Campaign Type has been Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/campaign-types/campaign-types']);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	addCampaignType(_campaignType: CampaignTypeModel, withBack: boolean = false) {
		this.loadingSubject.next(true);
		const payload = this.campaignTypeForm.value;
		console.log(payload);
		this.campaignsService.createCampaignType(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `New Campaign has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/campaign-types/campaign-types']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}


	reset() {
		this.campaignType = Object.assign({}, this.oldCampaign);
		this.initCampaignTypeForm();
		this.hasFormErrors = false;
		this.campaignTypeForm.markAsPristine();
		this.campaignTypeForm.markAsUntouched();
		this.campaignTypeForm.updateValueAndValidity();
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
