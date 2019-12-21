// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { LeadModel, LeadsService } from '../../../../../core/leads';

import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';

// material for table
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
	selector: 'kt-leads-list',
	templateUrl: './leads-list.component.html',
	styleUrls: ['./leads-list.component.scss']
})
export class LeadsListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	leads: LeadModel[];
	proceedingColumns: string[] = ['Name', 'Company', 'Email', 'Source', 'Status'];
	dataSource: any;
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	editedLead;
	statusColor;
	statuses = [
		'Lead Initiated', 'Email Sent', 'Scheduled Meeting', 'Sent MOU/Proposal',
		'Review MOU/Proposal', 'Follow Up Requested', 'Sent Invoice', 'Signed Agreement',
		'Converted to Contact'
	];
	constructor(
		private leadsService: LeadsService,
		private layoutUtilsService: LayoutUtilsService
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		let skip = this.pageIndex * this.limit;
		this.getAllLeads(skip, this.limit);
		this.leadsService.getLeadsCount('').subscribe(
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
	countLeads() {
		this.loadingSubject.next(true);
		this.leadsService.getLeadsCount('').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				// if(this.resultsLength )
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}


	checkStatusColor(color) {
		let allLeads = this.leads;
		allLeads.forEach(lead => {
			if (lead.status === 'Lead Initiated') {
				return this.statusColor = 'one';
			}
			if (lead.status === 'Email Sent') {
				return this.statusColor = 'two';
			}
			if (lead.status === 'Scheduled Meeting') {
				return this.statusColor = 'three';
			}
			if (lead.status === 'Sent MOU/Proposal') {
				return this.statusColor = 'four';
			}
			if (lead.status === 'Review MOU/Proposal') {
				return this.statusColor = 'five';
			}
			if (lead.status === 'Follow Up Requested') {
				return this.statusColor = 'six';
			}
			if (lead.status === 'Sent Invoice') {
				return this.statusColor = 'seven';
			}
			if (lead.status === 'Signed Agreement') {
				return this.statusColor = 'eight';
			}
			if (lead.status === 'Converted to Contact') {
				return this.statusColor = 'nine';
			}
		});
	}


	getAllLeads(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.leadsService.getLeads(skip, limit, '').subscribe(
			responseData => {
				this.leads = responseData['success'];
				this.loadingSubject.next(false);
				console.log('all leads returned', this.leads);
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
		this.getAllLeads(skip, this.limit);
		this.countLeads();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getAllLeads(skip, this.limit);
		this.countLeads();
		this.itemNav();
	}


	getLeadDetails(id) {
		this.leadsService.getLeadById(id).subscribe(
			responseData => {
				this.editedLead = responseData;
			},
			error => {
				console.log('error occures', error);
			}
		);
	}

	updateLead(lead, id) {
		this.leadsService.updateLead(lead, id).subscribe(
			data => {
				console.log('success reponse', data);
				const message = `Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				const skip = this.pageIndex * this.limit;
				this.getAllLeads(skip, this.limit);
			},
			error => {
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	changed(status, id) {
		this.loadingSubject.next(true);
		this.getLeadDetails(id);
		this.updateLead({ status }, id);
		this.loadingSubject.next(false);
	}

	ngOnDestroy() { }
}

