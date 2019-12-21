import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignModel, CampaignsService } from '../../../../../core/campaigns';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-campaign',
	templateUrl: './campaign.component.html',
	styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	campaignId: string;
	campaignDetails: any;
	pageTitle = 'Please wait...';
	nairaSign = '₦';
	constructor(
		private route: ActivatedRoute,
		private campaignsSevice: CampaignsService,
		private _location: Location,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.campaignId = this.route.snapshot.params['id'];
		this.campaignsSevice.getCampaignById(this.campaignId).subscribe(
			singleCampaign => {
				this.campaignDetails = singleCampaign['success'];
				console.log('this campaign details oninit', this.campaignDetails);
				this.loadingSubject.next(false);
				this.pageTitle = `${this.campaignDetails.name} - ${this.campaignDetails.type}`;
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
		const _title: string = 'Delete Campaign';
		const _description: string = 'Are you sure to permanently delete this Campaign?';
		const _waitDesciption: string = 'Campaign is deleting...';
		const _deleteMessage = `lead has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.campaignsSevice.deleteCampaign(this.campaignId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/strada/campaigns/campaigns']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}
}
