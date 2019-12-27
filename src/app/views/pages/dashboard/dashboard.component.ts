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
import { ComputationsService } from '../../../core/computations';

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
	assetsCount: any = '...';
	vendorsCount = '...';
	maturityAverage = '...';
	usersCount = '...';
	staffsCount = '...';
	calendarPlugins = [dayGridPlugin];
	events = [];
	allTasks;
	userDetails;
	leads: LeadModel[];
	limit = 10;
	editedLead;
	contacts: ContactModel[];
	resultsLength: number = 0;
	assetsArr;
	capExp = 0;
	capExpPercent = 0;
	assetPercent = 0;
	capitalCurrency = '₦';
	payload = {};
	constructor(
		private mdTasksService: MdTasksService,
		private usersService: UserService,
		private leadsService: LeadsService,
		private contactsService: ContactsService,
		private assetsService: AssetsService,
		private computationsService: ComputationsService,
		private store: Store<AppState>,
		private layoutUtilsService: LayoutUtilsService
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(false);
		this.getUsersCount();
		this.getStaffsCount();
		this.getMaturityScoreAverage();
		this.getAllAssets();
		this.initAssets();
		this.initCapitalExpenditure();
		console.clear();
	}

	getUsersCount() {
		this.usersService.getUsersCount().subscribe(
			countResult => {
				this.usersCount = countResult['data'];
			}
		);
	}

	getMaturityScoreAverage() {
		this.computationsService.getScoreAverage().subscribe(
			countResult => {
				this.maturityAverage = countResult['average'];
			}
		);
	}

	getStaffsCount() {
		this.usersService.getStaffsCount().subscribe(
			countResult => {
				this.staffsCount = countResult['data'];
			}
		);
	}
	initAssets() {
		const payload = {
			id: null
		};
		this.assetsService.getAllAssetsCount(payload).subscribe(
			assetsCountr => {
				this.assetsCount = assetsCountr['all_data'];
				this.assetPercent = 100;
			}
		);
	}

	initCapitalExpenditure() {
		const payload = {
			id: null
		};
		this.assetsService.getAllAssetsCapital(payload).subscribe(
			assetsCountr => {
				this.capExp = assetsCountr['total_amount'];
				this.capExpPercent = 100;
			}
		);
	}

	getCapitalExpenditure(event, type) {
		const val = event.target.value;
		if (type === 'currency') {
			this.payload['currency'] = event.target.value;
		}
		if (type === 'id') {
			this.payload['id'] = event.target.value;
		}
		if (val === 'null') {
			this.payload['id'] = null;
		}
		this.assetsService.getAllAssetsCapital(this.payload).subscribe(
			expCountr => {
				this.capExp = expCountr['total_amount'];
				this.capExpPercent = 100;
				if (expCountr['currency'] === 'dollar') {
					this.capitalCurrency = '$';
				} else {
					this.capitalCurrency = '₦';
				}
				if (typeof expCountr['amount'] === 'number') {
					this.capExp = expCountr['amount'];
					this.capExpPercent = (expCountr['amount'] / expCountr['total_amount']) * 100;
				}
			}
		);
	}

	getAllAssetCount(event) {
		console.log(event.target.value);
		const val = event.target.value;
		let payload = { 'id': val };
		if (val === 'null') {
			payload = null;
		}
		this.assetsService.getAllAssetsCount(payload).subscribe(
			assetsCountr => {
				this.assetsCount = assetsCountr['all_data'];
				this.assetPercent = 100;
				if (typeof assetsCountr['data'] === 'number') {
					this.assetsCount = assetsCountr['data'];
					this.assetPercent = (assetsCountr['data'] / assetsCountr['all_data']) * 100;
				}
			}
		);
	}

	getAllAssets() {
		this.assetsService.getAllAssets().subscribe(
			assetsAll => {
				this.assetsArr = assetsAll['data'];
			}
		);
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
		this.contactsService.getContacts(skip, limit, '').subscribe(
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
