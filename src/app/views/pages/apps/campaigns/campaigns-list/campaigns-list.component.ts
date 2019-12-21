// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { CampaignModel, CampaignsService } from '../../../../../core/campaigns';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';

// material for table
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
	selector: 'kt-campaigns-list',
	templateUrl: './campaigns-list.component.html',
	styleUrls: ['./campaigns-list.component.scss']
})
export class CampaignsListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	campaigns: CampaignModel[];
	proceedingColumns: string[] = ['Name', 'Type', 'Price', 'Created On', 'Status', 'Actions'];
	dataSource: any;
	nairaSign = '₦';
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	editedCampaign;
	statuses = ['Planning', 'Running', 'Terminated', 'Inactive', 'Complete'];
	constructor(
		private campaignsService: CampaignsService,
		private layoutUtilsService: LayoutUtilsService) { }
	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);

		let skip = this.pageIndex * this.limit;
		this.getCampaigns(skip, this.limit);
		this.campaignsService.getCampaignsCount('').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				this.loadingSubject.next(false);
				if (this.resultsLength <= 10) {
					console.log('not up to 10', this.resultsLength);
					this.disableNext = true;
				} else {
					console.log('up to 10', this.resultsLength);
					this.disableNext = false;
				}
			}
		);
	}
	countCampaings() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.campaignsService.getCampaignsCount('').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				this.loadingSubject.next(false);
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}
	getCampaigns(skip, limit) {
		this.loadingSubject.next(true);
		this.campaignsService.getCampaigns(skip, limit, '').subscribe(
			responseData => {
				this.campaigns = responseData['success'];
				this.dataSource = new MatTableDataSource<CampaignModel>(this.campaigns);
				this.loadingSubject.next(false);
				console.log('all campaigns returned', this.campaigns);
			},
			error => {
				console.log('error', error);
			});
	}
	itemNav() {
		if (((this.pageIndex * 10) + 10) >= this.resultsLength) {
			this.disableNext = true;
			console.log('paste total numbers');
			// return;
		} else {
			this.disableNext = false;
		}
		if (this.pageIndex === 0) {
			this.disablePrev = true;
			console.log('last page');
			// return;
		} else {
			this.disablePrev = false;
		}
	}
	getNext() {
		this.pageIndex = this.pageIndex + 1;
		let skip = this.pageIndex * this.limit;
		this.getCampaigns(skip, this.limit);
		this.countCampaings();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getCampaigns(skip, this.limit);
		this.countCampaings();
		this.itemNav();
	}

	getCampaignDetails(id) {
		this.loadingSubject.next(true);
		this.campaignsService.getCampaignById(id).subscribe(
			responseData => {
				this.editedCampaign = responseData;
			},
			error => {
				console.log('error occures', error);
			}
		);
	}

	updateCampaign(campaign, id) {
		this.campaignsService.updateCampaign(campaign, id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				const skip = this.pageIndex * this.limit;
				this.getCampaigns(skip, this.limit);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	changed(status, id) {
		this.loadingSubject.next(true);
		this.getCampaignDetails(id);
		this.updateCampaign({status}, id);
		this.loadingSubject.next(false);
	}

	onDelete(id) {
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
			this.campaignsService.deleteCampaign(id).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					const skip = this.pageIndex * this.limit;
					this.getCampaigns(skip, this.limit);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}

	ngOnDestroy() { }
}

