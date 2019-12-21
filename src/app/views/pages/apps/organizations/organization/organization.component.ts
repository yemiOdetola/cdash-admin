import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationsService } from '../../../../../core/organizations';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-organization',
	templateUrl: './organization.component.html',
	styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	organizationId: string;
	organizationDetails: any;
	pageTitle = 'Please wait...';
	fileName;
	fSelected;
	constructor(
		private route: ActivatedRoute,
		private organizationsService: OrganizationsService,
		private _location: Location,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.organizationId = this.route.snapshot.params['id'];
		this.getOrganizationDetails();
		console.log('id returned', this.route.snapshot.params['id']);
	}

	getOrganizationDetails() {
		this.organizationsService.getOrganizationById(this.organizationId).subscribe(
			singleOrganization => {
				this.organizationDetails = singleOrganization['success'];
				this.loadingSubject.next(false);
				this.pageTitle = `Organizations Details`;
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
	}

	goBack() {
		this._location.back();
	}

	onDelete() {
		const _title: string = 'Delete Organization';
		const _description: string = 'Are you sure to permanently delete this Organization?';
		const _waitDesciption: string = 'Organization will be deleted...';
		const _deleteMessage = `Organization has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.organizationsService.deleteOrganization(this.organizationId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/strada/organizations/organizations']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}
}
