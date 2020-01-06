// Angular
import { Component, OnInit } from '@angular/core';
import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';
import { Observable, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { User } from '../../../core/auth';
import { AppState } from '../../../core/reducers';
import { Router } from '@angular/router';
// calender
import dayGridPlugin from '@fullcalendar/daygrid';
import { MdTasksService } from '../../../core/md-tasks';
import { UserService } from '../../../core/users';
import { LeadsService, LeadModel } from '../../../core/leads';
import { ContactsService, ContactModel } from '../../../core/contacts';
import { AssetsService } from '../../../core/assets';
import { AuthService } from '../../../core/auth';
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
	assetsCount = 0;
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
	reccCurrency = '₦';
	payload = {};
	recExp = 0;
	recExpPercent = 0;
	recurrentData;
	capEprData;
	constructor(
		private mdTasksService: MdTasksService,
		private auth: AuthService,
		private usersService: UserService,
		private leadsService: LeadsService,
		private contactsService: ContactsService,
		private assetsService: AssetsService,
		private computationsService: ComputationsService,
		private store: Store<AppState>,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService
	) { }

	ngOnInit() {
		this.auth.checkOrganization().subscribe(response => {
			if (response.status === true && localStorage.getItem('userToken')) {
				return;
			} else {
				this.router.navigate(['/auth/login']);
			}
		});
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.initAssets();
		this.getUsersCount();
		this.getStaffsCount();
		this.getMaturityScoreAverage();
		this.getAllAssets();
		this.initRecurrentExpenditure();
		this.initCapitalExpenditure();
		console.clear();
	}

	getUsersCount() {
		this.loadingSubject.next(true);
		this.usersService.getUsersCount().subscribe(
			countResult => {
				this.loadingSubject.next(false);
				this.usersCount = countResult['data'];
			}
		);
	}

	getMaturityScoreAverage() {
		this.loadingSubject.next(true);
		this.computationsService.getScoreAverage().subscribe(
			countResult => {
				this.maturityAverage = countResult['average'];
				this.loadingSubject.next(false);
			}
		);
	}

	getStaffsCount() {
		this.loadingSubject.next(true);
		this.usersService.getStaffsCount().subscribe(
			countResult => {
				this.staffsCount = countResult['data'];
				this.loadingSubject.next(false);
			}
		);
	}
	initAssets() {
		this.loadingSubject.next(true);
		const payload = {
			id: null
		};
		this.assetsService.getAllAssetsCount(payload).subscribe(
			assetsCountr => {
				this.assetsCount = assetsCountr['all_data'];
				this.assetPercent = 100;
				this.loadingSubject.next(false);
			}
		);
	}

	initCapitalExpenditure() {
		this.loadingSubject.next(true);
		const payload = {
			id: null
		};
		this.assetsService.getAllAssetsCapital(payload).subscribe(
			assetsCountr => {
				if (this.capitalCurrency === '₦') {
					this.capExp = assetsCountr['total_amount_naira'];
				} else {
					this.capExp = assetsCountr['total_amount_dollar'];
				}
				this.loadingSubject.next(false);
			}
		);
	}

	getCapitalExpenditure(event, type) {
		this.loadingSubject.next(true);
		const val = event.target.value;
		if (type === 'currency') {
			if (event.target.value === 'naira') {
				this.capitalCurrency = '₦';
				this.loadingSubject.next(false);
				return this.capExp = this.capEprData.total_amount_naira;
			} else {
				this.capitalCurrency = '$';
				this.loadingSubject.next(false);
				return this.capExp = this.capEprData.total_amount_dollar;
			}
		}
		if (type === 'id') {
			this.payload['id'] = event.target.value;
		}
		if (val === 'null') {
			this.payload['id'] = null;
		}
		this.assetsService.getAllAssetsCapital(this.payload).subscribe(
			expCountr => {
				this.capEprData = expCountr;
				if (this.capitalCurrency === '₦') {
					this.capExp = expCountr['amount_naira'] || 0;
				} else {
					this.capExp = expCountr['amount_dollar'] || 0;
				}
				this.loadingSubject.next(false);
			});
	}


	initRecurrentExpenditure() {
		this.loadingSubject.next(true);
		const payload = {
			id: null
		};
		this.assetsService.getAssetsReccurentExp(payload).subscribe(
			assetsCountr => {
				this.recurrentData = assetsCountr;
				if (this.reccCurrency === '₦') {
					this.recExp = assetsCountr['total_amount_naira'];
				} else {
					this.recExp = assetsCountr['total_amount_dollar'];
				}
				this.recExpPercent = 100;
				this.loadingSubject.next(false);
			}
		);
	}

	getAssetsReccurent(event, type) {
		this.loadingSubject.next(true);
		const val = event.target.value;
		if (type === 'currency') {
			if (event.target.value === 'naira') {
				this.reccCurrency = '₦';
				this.loadingSubject.next(false);
				return this.recExp = this.recurrentData.total_amount_naira;
			} else {
				this.reccCurrency = '$';
				this.loadingSubject.next(false);
				return this.recExp = this.recurrentData.total_amount_dollar;
			}
		}
		if (type === 'id') {
			this.payload['id'] = event.target.value;
		}
		if (val === 'null') {
			this.payload['id'] = null;
		}
		this.assetsService.getAssetsReccurentExp(this.payload).subscribe(
			recExpCountr => {
				if (this.reccCurrency === '₦') {
					this.recExp = recExpCountr['amount_naira'];
				} else {
					this.recExp = recExpCountr['amount_dollar'];
				}
				this.loadingSubject.next(false);
			}
		);
	}

	getAllAssetCount(event) {
		this.loadingSubject.next(true);
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
				this.loadingSubject.next(false);
			}
		);
	}

	getAllAssets() {
		this.loadingSubject.next(true);
		this.assetsService.getAllAssets().subscribe(
			assetsAll => {
				this.assetsArr = assetsAll['data'];
				this.loadingSubject.next(false);
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
}
