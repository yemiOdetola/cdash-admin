// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { OrganizationModel, OrganizationsService } from '../../../../../core/organizations';
import { LayoutUtilsService } from '../../../../../core/_base/crud';

@Component({
	selector: 'kt-organizations-list',
	templateUrl: './organizations-list.component.html',
	styleUrls: ['./organizations-list.component.scss']
})
export class OrganizationsListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	organizations: OrganizationModel[];
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	editedStatus;
	editedOrganization;
	constructor(
		private organizationsService: OrganizationsService,
		private layoutUtilsService: LayoutUtilsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.organizationsService.getOrganizationsCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if ( this.resultsLength <= 10) {
					console.log('not up to 10', this.resultsLength);
					this.disableNext = true;
				} else {
					console.log('up to 10', this.resultsLength);
					this.disableNext = false;
				}
			}
		);
		let skip = this.pageIndex * this.limit;
		this.getOrganizations(skip, this.limit);
	}

	getOrganizationsCount() {
		this.organizationsService.getOrganizationsCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}

	getOrganizations(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.organizationsService.getOrganizations(skip, limit).subscribe(
			responseData => {
				this.organizations = responseData['success'];
				this.loadingSubject.next(false);
				console.log('all organization returned', this.organizations);
			},
			error => {
				console.log('error', error);
			}
		);
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
		this.getOrganizations(skip, this.limit);
		this.getOrganizationsCount();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getOrganizations(skip, this.limit);
		this.getOrganizationsCount();
		this.itemNav();
	}

	ngOnDestroy() { }
}

