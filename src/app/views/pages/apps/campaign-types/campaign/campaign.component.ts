import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignTypeModel, CampaignsService } from '../../../../../core/campaign-types';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-campaign-type',
	templateUrl: './campaign.component.html',
	styleUrls: ['./campaign.component.scss']
})
export class CampaignTypeComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	campaignTypeId: string;
	campaignTypeDetails: any;
	pageTitle = 'Please wait...';
	constructor(
		private route: ActivatedRoute,
		private campaignsService: CampaignsService,
		private _location: Location,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.campaignTypeId = this.route.snapshot.params['id'];
		this.campaignsService.getCampaignTypeById(this.campaignTypeId).subscribe(
			singleCampaignType => {
				this.campaignTypeDetails = singleCampaignType['success'];
				console.log('single type', this.campaignTypeDetails);
				this.loadingSubject.next(false);
				this.pageTitle = `${this.campaignTypeDetails.name}`;
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
		console.log('id returned', this.route.snapshot.params['id']);
	}

	goBack() {
		this._location.back();
	}

	onDelete() {
		const _title: string = 'Delete Lead';
		const _description: string = 'Are you sure to permanently delete this Campaign Type?';
		const _waitDesciption: string = 'Campaign Type will be deleted...';
		const _deleteMessage = `Campaign Type has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.campaignsService.deleteCampaignType(this.campaignTypeId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/strada/campaign-types/campaign-types']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}
}
