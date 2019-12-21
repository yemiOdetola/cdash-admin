// Angular
import { Component, OnInit } from '@angular/core';
import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';
import { Observable, BehaviorSubject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { currentUser, Logout, User } from '../../../core/auth';
import { AppState } from '../../../core/reducers';
// calender
import dayGridPlugin from '@fullcalendar/daygrid';
import { MdTasksService } from '../../../core/md-tasks';
import { UserService } from '../../../core/users';
import { LeadsService, LeadModel } from '../../../core/leads';
import { ContactsService, ContactModel } from '../../../core/contacts';
import { AssetsService } from '../../../core/assets';
import { VendorsService } from '../../../core/vendors';
import { CampaignsService } from '../../../core/campaigns';

@Component({
	selector: 'kt-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	user$: Observable<User>;
	leadsCount = '...';
	contactsCount = '...';
	assetsCount = '...';
	vendorsCount = '...';
	campaignsCount = '...';
	usersCount;
	calendarPlugins = [dayGridPlugin];
	events = [];
	allTasks;
	userDetails;
	leads: LeadModel[];
	limit = 10;
	editedLead;
	contacts: ContactModel[];
	resultsLength: number = 0;
	showing = 'Leads';
	statuses = [
		'Lead Initiated', 'Email Sent', 'Scheduled Meeting', 'Sent MOU/Proposal',
		'Review MOU/Proposal', 'Follow Up Requested', 'Sent Invoice', 'Signed Agreement',
		'Converted to Contact'
	];
	constructor(
		private mdTasksService: MdTasksService,
		private usersService: UserService,
		private leadsService: LeadsService,
		private contactsService: ContactsService,
		private assetsService: AssetsService,
		private vendorsService: VendorsService,
		private campaignsService: CampaignsService,
		private store: Store<AppState>,
		private layoutUtilsService: LayoutUtilsService
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(false);
		// this.user$ = this.store.pipe(select(currentUser));
		// this.user$.subscribe(
		// 	userData => {
		// 		this.getUserDetails(userData['_id']);
		// 	}
		// );
		// this.getAssetsCount();
		// this.getCampaignsCount();
		// this.getContactsCount();
		// this.getLeadsCount();
		// this.getVendorsCount();
		// this.getMyTasksEvery();
		// this.getAllLeads(0, 9);
		// this.getContacts(0, 9);
	}

	getAllLeads(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.leadsService.getLeads(skip, limit, '').subscribe(
			responseData => {
				this.leads = responseData['success'];
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			});
	}

	getContacts(skip, limit) {
		this.loadingSubject.next(true);
		this.contactsService.getContacts(skip, limit,'').subscribe(
			responseData => {
				this.contacts = responseData['success'];
				this.loadingSubject.next(false);
				console.log('all contacts returned', this.contacts);
			},
			error => {
				console.log('error', error);
			});
	}

	getUserDetails(id) {
		this.loadingSubject.next(true);
		this.usersService.getUserById(id).subscribe(
			singleUser => {
				this.userDetails = singleUser['user'];
				localStorage.setItem('loginData', JSON.stringify(this.userDetails));
				if (this.userDetails) {
					if (this.userDetails.admin || this.userDetails.head) {
						this.getUsersCount();
					}
				}
			},
			error => {
				console.log('error occured', error);
			}
		);
	}

	getUsersCount() {
		this.usersService.getUsersCount().subscribe(
			countResult => {
				this.usersCount = countResult['count'];
			}
		);
	}
	getLeadsCount() {
		this.leadsService.getLeadsCount('').subscribe(
			countResult => {
				this.leadsCount = countResult['count'];
			}
		);
	}
	getAssetsCount() {
		this.assetsService.getAssetsCount().subscribe(
			countResult => {
				this.assetsCount = countResult['count'];
			}
		);
	}
	getVendorsCount() {
		this.vendorsService.getVendorsCount().subscribe(
			countResult => {
				this.vendorsCount = countResult['count'];
			}
		);
	}
	getCampaignsCount() {
		this.campaignsService.getCampaignsCount('').subscribe(
			countResult => {
				this.campaignsCount = countResult['count'];
			}
		);
	}
	getContactsCount() {
		this.contactsService.getContactsCount('').subscribe(
			countResult => {
				this.contactsCount = countResult['count'];
			}
		);
	}

	showTable(table) {
		this.showing = table;
	}

	getMyTasksEvery() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.mdTasksService.getMyTaskEvery().subscribe(
			responseData => {
				this.allTasks = responseData['success'];
				let calObj = {};
				let allTasksArray = [];
				let tasksCal = this.allTasks;
				tasksCal.forEach(task => {
					allTasksArray.push({
						title: task.name,
						date: task.created_at
					});
					this.events = allTasksArray;
				});
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			});
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
				this.getAllLeads(0, 10);
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
}
