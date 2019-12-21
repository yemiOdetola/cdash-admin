import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel, UserService } from '../../../../../core/users';
import { LeadModel, LeadsService } from '../../../../../core/leads';
import { ContactModel, ContactsService } from '../../../../../core/contacts';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { HrDialogComponent } from './hr-dialog/hr-dialog.component';
import { RolesDialogComponent } from './roles-dialog/roles-dialog.component';
import { CampaignModel, CampaignsService } from '../../../../../core/campaigns';
import { MeetingModel, MeetingsService } from '../../../../../core/meetings';
import { ProjectModel, ProjectsService } from '../../../../../core/projects';
import { MdTaskModel, MdTasksService } from '../../../../../core/md-tasks';
import { ClaimModel, ClaimsService } from '../../../../../core/claims';
import { Location } from '@angular/common';


@Component({
	selector: 'kt-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
	loading$: Observable<boolean>;
	proceedingColumns: string[] = ['Name', 'Company', 'Email', 'Phone', 'Source', 'Status'];
	proceedingColumns2: string[] = ['Name', 'Company', 'Email', 'Phone', 'Source'];
	proceedingColumns3: string[] = ['Name', 'Status', 'Type', 'Price', 'Created On', 'Updated On'];
	proceedingColumns4: string[] = ['Client', 'Duration', 'Start', 'Description', 'Type'];
	proceedingColumns5: string[] = ['Name', 'Description', 'Created On', 'Status'];
	proceedingColumns6: string[] = ['Name', 'Created On', 'Description', 'Status'];
	proceedingColumns7: string[] = ['Name', 'Created On', 'Updated On'];
	loadingSubject = new BehaviorSubject<boolean>(true);
	userId: string;
	leads: LeadModel[];
	claims: LeadModel[];
	meetings: MeetingModel[] = [];
	projects: ProjectModel[] = [];
	pageIndex = [0, 0, 0, 0, 0, 0, 0];
	mdTasks: MdTaskModel[] = [];
	limit = [10];
	resultsLength: [number] = [0];
	userDetails: any;
	pageTitle = 'Please wait...';
	passwordDetails = {};
	disablePrev = [true, true, true, true, true, true, true];
	leadSource: any;
	meetingSource: any;
	projectSource: any;
	contacts: ContactModel[];
	campaigns: CampaignModel[];
	contactSource: any;
	campaignSource: any;
	claimSource: any;
	taskSource: any;
	hod: any;
	showing = 'Leads';
	nairaSign = '₦';
	disableNext = [true, true, true, true, true, true, true];
	constructor(
		private route: ActivatedRoute,
		private usersService: UserService,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router,
		public dialog: MatDialog,
		private leadsService: LeadsService,
		private _location: Location,
		private contactsService: ContactsService,
		private campaignsService: CampaignsService,
		private meetingsService: MeetingsService,
		private projectsService: ProjectsService,
		private mdTasksService: MdTasksService,
		private claimsService: ClaimsService,
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.userId = this.route.snapshot.params['id'];
		this.usersService.getUserById(this.userId).subscribe(
			singleUser => {
				this.userDetails = singleUser['user'];
				this.loadingSubject.next(false);
				this.loadingSubject.next(true);
				if (this.userDetails.head_id) {
					this.usersService.getUserById(this.userDetails.head_id).subscribe(
						singleUser2 => {
							this.hod = singleUser2['user'];
							this.loadingSubject.next(false);
						},
						error => {
							this.loadingSubject.next(false);
						}
					);
				}
				console.log('this user details oninit', this.userDetails);
				this.pageTitle = `${this.userDetails.name}`;
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
		this.getAll(0, 0, 10);
		this.countAll(0);
		this.getAll(1, 0, 10);
		this.countAll(1);
		this.getAll(2, 0, 10);
		this.countAll(2);
		this.getAll(3, 0, 10);
		this.countAll(3);
		this.getAll(4, 0, 10);
		this.countAll(4);
		this.getAll(5, 0, 10);
		this.countAll(5);
		this.getAll(6, 0, 10);
		this.countAll(6);
	}

	goBack() {
		this._location.back();
	}

	countAll(index) {
		this.loadingSubject.next(true);
		if (index === 0) {
			this.leadsService.getLeadsCount(this.userId).subscribe(
				countResult => {
					this.resultsLength[index] = countResult['count'];
					if (this.resultsLength[index] <= 10) {
						this.disableNext[index] = true;
					} else {
						this.disableNext[index] = false;
					}
				}
			);
		} else if (index === 1) {
			this.contactsService.getContactsCount(this.userId).subscribe(
				countResult => {
					this.resultsLength[index] = countResult['count'];
					if (this.resultsLength[index] <= 10) {
						this.disableNext[index] = true;
					} else {
						this.disableNext[index] = false;
					}
				}
			);
		} else if (index === 2) {
			this.campaignsService.getCampaignsCount(this.userId).subscribe(
				countResult => {
					this.resultsLength[index] = countResult['count'];
					this.loadingSubject.next(false);
					if (this.resultsLength[index] <= 10) {
						console.log('not up to 10', this.resultsLength);
						this.disableNext[index] = true;
					} else {
						console.log('up to 10', this.resultsLength);
						this.disableNext[index] = false;
					}
				}
			);
		} else if (index === 3) {
			this.meetingsService.getMeetingsCount('').subscribe(
				countResult => {
					this.resultsLength[index] = countResult['count'];
					if (this.resultsLength[index] <= 10) {
						this.disableNext[index] = true;
					} else {
						this.disableNext[index] = false;
					}
				}
			);
		} else if (index === 4) {
			this.projectsService.getProjectsCount('').subscribe(
				countResult => {
					this.resultsLength[index] = countResult['count'];
					if (this.resultsLength[index] <= 10) {
						console.log('not up to 10', this.resultsLength);
						this.disableNext[index] = true;
					} else {
						console.log('up to 10', this.resultsLength);
						this.disableNext[index] = false;
					}
				}
			);
		} else if (index === 5) {
			this.mdTasksService.getMdTasksCount(this.userId).subscribe(
				countResult => {
					this.resultsLength[index] = countResult['count'];
					if (this.resultsLength[index] <= 10) {
						console.log('not up to 10', this.resultsLength);
						this.disableNext[index] = true;
					} else {
						console.log('up to 10', this.resultsLength);
						this.disableNext[index] = false;
					}
				}
			);
		} else if (index === 6) {
			this.claimsService.getClaimsCount(1, 'claim', this.userId).subscribe(
				countResult => {
					this.resultsLength[index] = countResult['count'];
					if (this.pageIndex[index] > 0) {
						this.disablePrev[index] = false;
					}
				}
			);
		}
	}
	getAll(index, skip, limit) {
		this.loadingSubject.next(true);
		if (index === 0) {
			this.leadsService.getLeads(skip, limit, this.userId).subscribe(
				responseData => {
					this.leads = responseData['success'];
					this.leadSource = new MatTableDataSource<LeadModel>(this.leads);
					this.loadingSubject.next(false);
					console.log('all leads returned', this.leads);
				},
				error => {
					console.log('error', error);
				});
		} else if (index === 1) {
			this.loadingSubject.next(true);
			this.contactsService.getContacts(skip, limit, this.userId).subscribe(
				responseData => {
					this.contacts = responseData['success'];
					this.contactSource = new MatTableDataSource<ContactModel>(this.contacts);
					this.loadingSubject.next(false);
					console.log('all contacts returned', this.contacts);
				},
				error => {
					console.log('error', error);
				});
		} else if (index === 2) {
			this.campaignsService.getCampaigns(skip, limit, this.userId).subscribe(
				responseData => {
					this.campaigns = responseData['success'];
					this.campaignSource = new MatTableDataSource<CampaignModel>(this.campaigns);
					this.loadingSubject.next(false);
					console.log('all campaigns returned', this.campaigns);
				},
				error => {
					console.log('error', error);
				});
		} else if (index === 3) {
			this.meetingsService.getMeetings(skip, limit, this.userId).subscribe(
				responseData => {
					this.meetings = responseData['success'];
					this.meetingSource = new MatTableDataSource<MeetingModel>(this.meetings);
					this.loadingSubject.next(false);
				},
				error => {
					console.log('error', error);
				}
			);
		} else if (index === 4) {
			this.projectsService.getProjects(skip, limit, this.userId).subscribe(
				responseData => {
					this.projects = responseData['success'];
					this.projectSource = new MatTableDataSource<ProjectModel>(this.projects);
					this.loadingSubject.next(false);
				},
				error => {
					console.log('error', error);
				}
			);
		} else if (index === 5) {
			this.mdTasksService.getMdTasks(skip, limit, this.userId).subscribe(
				responseData => {
					this.mdTasks = responseData['success'];
					this.taskSource = new MatTableDataSource<MdTaskModel>(this.mdTasks);
					this.loadingSubject.next(false);
					console.log('all md-tasks returned', this.mdTasks);
				},
				error => {
					console.log('error', error);
					this.loadingSubject.next(false);
				});
		} else if (index === 6) {
			this.claimsService.getClaims(skip, limit, 'claim', this.userId).subscribe(
				responseData => {
					this.claims = responseData['success'];
					if (responseData['success'].length > 0) {
						console.log('start data', responseData['success'][0].toString());
						this.claimSource = new MatTableDataSource<ClaimModel>(this.claims);
						this.loadingSubject.next(false);
						console.log('all claims returned', this.claims);
					}
				},
				error => {
					console.log('error', error);
				});
		}
	}
	itemNav(index) {
		if (((this.pageIndex[index] * 10) + 10) >= this.resultsLength[index]) {
			this.disableNext[index] = true;
		} else {
			this.disableNext[index] = false;
		}
		if (this.pageIndex[index] === 0) {
			this.disablePrev[index] = true;
			console.log('last page');
		} else {
			this.disablePrev[index] = false;
		}
	}
	getNext(index) {
		this.pageIndex[index] = this.pageIndex[index] + 1;
		let skip = this.pageIndex[index] * this.limit[index];
		this.getAll(index, skip, this.limit);
		this.countAll(index);
		this.itemNav(index);
	}

	getPrev(index) {
		this.pageIndex[index] = this.pageIndex[index] - 1;
		let skip = this.pageIndex[index] * this.limit[index];
		this.getAll(index, skip, this.limit);
		this.countAll(index);
		this.itemNav(index);
	}

	showTable(table) {
		this.showing = table;
	}

	assign() {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = false;
		// dialogConfig.autoFocus = true;
		dialogConfig.width = '500px';
		const dialogRef = this.dialog.open(HrDialogComponent, dialogConfig);
		dialogRef.componentInstance.headId = this.userId;
		dialogRef.afterClosed().subscribe(
			// fetch user;
			passwordFormData => {
				this.loadingSubject.next(true);
				this.usersService.getUserById(this.userId).subscribe(
					singleUser => {
						this.userDetails = singleUser['user'];
						this.loadingSubject.next(false);
						this.loadingSubject.next(true);
						if (this.userDetails.head_id) {
							this.usersService.getUserById(this.userDetails.head_id).subscribe(
								singleUser2 => {
									this.hod = singleUser2['user'];
									this.loadingSubject.next(false);
								},
								error => {
									this.loadingSubject.next(false);
								}
							);
						}
						console.log('this user details oninit', this.userDetails);
						this.pageTitle = `${this.userDetails.name}`;
					},
					error => {
						console.log('error occured', error);
						this.loadingSubject.next(false);
					}
				);
			}
		);
	}
	doRole() {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = false;
		// dialogConfig.autoFocus = true;
		dialogConfig.width = '500px';
		const dialogRef = this.dialog.open(RolesDialogComponent, dialogConfig);
		dialogRef.componentInstance.userId = this.userId;
		dialogRef.componentInstance.myRoles = this.userDetails.roleNames;
		dialogRef.afterClosed().subscribe(
			// fetch user;
			passwordFormData => {
				this.loadingSubject.next(true);
				this.usersService.getUserById(this.userId).subscribe(
					singleUser => {
						this.userDetails = singleUser['user'];
						this.loadingSubject.next(false);
						this.loadingSubject.next(true);
						if (this.userDetails.head_id) {
							this.usersService.getUserById(this.userDetails.head_id).subscribe(
								singleUser2 => {
									this.hod = singleUser2['user'];
									this.loadingSubject.next(false);
								},
								error => {
									this.loadingSubject.next(false);
								}
							);
						}
						console.log('this user details oninit', this.userDetails);
						this.pageTitle = `${this.userDetails.name}`;
					},
					error => {
						console.log('error occured', error);
						this.loadingSubject.next(false);
					}
				);
			}
		);

	}
	onDelete() {
		const _title: string = 'Delete User';
		const _description: string = 'Are you sure to permanently delete this User?';
		const _waitDesciption: string = 'Deleting User';
		const _deleteMessage = `User has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.usersService.deleteUser(this.userId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/strada/users/users']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}

	makeHod() {
		const _title: string = 'Make User HOD';
		const _description: string = 'Are you sure to make this user HOD?';
		const _waitDesciption: string = 'Making User Hod';
		const _deleteMessage = `User is now an Hod`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, 'make hod');
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.usersService.hodUser(this.userId).subscribe(
				hod => {
					delete this.hod;
					this.usersService.getUserById(this.userId).subscribe(
						singleUser => {
							this.userDetails = singleUser['user'];
							console.log('this user details oninit', this.userDetails);
							this.loadingSubject.next(false);
							this.pageTitle = `${this.userDetails.name}`;
						},
						error => {
							console.log('error occured', error);
							this.loadingSubject.next(false);
						}
					);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}

	removeHod() {
		const _title: string = 'Remove User as HOD';
		const _description: string = 'Are you sure to remove this user as HOD?';
		const _waitDesciption: string = 'Removing User as Hod';
		const _deleteMessage = `User is no longer an Hod`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, 'Remove as hod');
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.usersService.removehodUser(this.userId).subscribe(
				hod => {
					delete this.hod;
					this.usersService.getUserById(this.userId).subscribe(
						singleUser => {
							this.userDetails = singleUser['user'];
							console.log('this user details oninit', this.userDetails);
							this.loadingSubject.next(false);
							this.pageTitle = `${this.userDetails.name}`;
						},
						error => {
							console.log('error occured', error);
							this.loadingSubject.next(false);
						}
					);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}
}
