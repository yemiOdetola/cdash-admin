// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { ClaimsService } from '../../../../../core/claims';
import { UserService } from '../../../../../core/users';
import { OrganizationsService } from '../../../../../core/organizations';
// Services and Models
import { RoleModel, RolesService } from '../../../../../core/roles';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';

// material for table
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-roles-list',
	templateUrl: './roles-list.component.html',
	styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	roles: RoleModel[];
	proceedingColumns: string[] = ['Name', 'Email', 'Phone',];
	dataSource: any;
	resultsLength: number = 0;
	newHODForm: FormGroup;
	hodForm: FormGroup;
	addSubRoleForm: FormGroup;
	pageIndex = 0;
	limit = 10;
	organizationDetails;
	organizationId = '';
	disablePrev = true;
	disableNext = false;
	selected = 'roles';
	activeTab = 'hodForm';
	claimRoles;
	users = [];
	allUsers;
	hods;
	userData: any;
	hodId = '';
	roleSelect = true;
	hodsUsers;
	currentHOD = 0;
	usersArr = [];
	constructor(private rolesService: RolesService,
		private layoutUtilsService: LayoutUtilsService,
		private fb: FormBuilder,
		private _location: Location,
		private usersService: UserService,
		private organizationsService: OrganizationsService,
		private claimsService: ClaimsService,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.userData = JSON.parse(localStorage.getItem('loginData'));
		this.getAllClaims();
		this.getAllUsers(0, 999);
		this.organizationId = localStorage.getItem('organizationId');
		this.rolesService.getRolesCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
				if (this.resultsLength <= 10) {
					console.log('not up to 10', this.resultsLength);
					this.disableNext = true;
				} else {
					console.log('up to 10', this.resultsLength);
					this.disableNext = false;
				}
			}
		);
		let skip = this.pageIndex * this.limit;
		this.getAllHODs(this.userData._id);
		this.getAllRoles(skip, this.limit);
		this.initNewHodForm();
		this.initHODForm();
		this.initAddSubRoleForm();
		setTimeout(() => {
			this.getOrganizationDetails();
		}, 20);
	}

	selectUser(hodId) {
		this.hodId = hodId;
		this.roleSelect = false;
		console.log(this.hodId);
		this.activateTab('hodForm', 'preselected');
	}

	getAllHODs(id) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.usersService.hodList(id).subscribe(
			responseData => {
				this.hods = responseData['success'];
				let hods = this.hods;
				for (let i = 0; i < hods.length; i++) {
					this.getHODsUsers(hods[i]._id, i);
				}
				// hods.forEach(hod => {
				// 	this.getHODsUsers(hod._id);
				// });
				this.loadingSubject.next(false);
				console.log('all users returned', this.users);
			},
			error => {
				console.log('error', error);
			}
		);
	}

	showMyUsers(i) {
		return this.currentHOD = i;
	}

	getHODsUsers(id, i) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.usersService.getHODUsers(0, 999, id).subscribe(
			responseData => {
				this.usersArr.splice(i, 0, responseData['success']);
				this.hodsUsers = responseData['success'];
				this.loadingSubject.next(false);
				console.log('all hod users returned', this.hodsUsers);
			},
			error => {
				console.log('error', error);
			}
		);
	}

	getAllUsers(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.usersService.getUsers(skip, limit).subscribe(
			responseData => {
				this.allUsers = responseData['success'];
				let userss = this.allUsers;
				userss.forEach(user => {
					if (!user.head) {
						this.users.push(user);
					}
				});
				this.loadingSubject.next(false);
				console.log('all users returned', this.users);
			},
			error => {
				console.log('error', error);
			}
		);
	}

	getOrganizationDetails() {
		this.organizationsService.getOrganizationById(this.organizationId).subscribe(
			singleOrganization => {
				this.organizationDetails = singleOrganization['success'];
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
	}

	activateTab(tab, option?) {
		if (option) {
			this.roleSelect = false;
		} else {
			this.roleSelect = true;
		}
		if (this.activeTab !== tab) {
			this.activeTab = tab;
			return;
		}
	}

	initNewHodForm() {
		this.newHODForm = this.fb.group({
			user_id: ['', Validators.required]
		});
	}
	initHODForm() {
		this.hodForm = this.fb.group({
			user_id: ['', Validators.required],
			hod_id: ['', Validators.required]
		});
	}

	assignUserToHOD() {
		this.loadingSubject.next(true);
		const userId = this.hodForm.value.user_id;
		let hodId = !this.hodId ? this.hodForm.value.hod_id : this.hodId;
		this.usersService.assign(userId, hodId).subscribe(
			response => {
				console.log(response);
				const message = `Successful`;
				this.getAllUsers(0, 999);
				this.getAllHODs(this.userData._id);
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.initHODForm();
				this.hodForm.markAsPristine();
				this.hodForm.markAsUntouched();
				this.hodForm.updateValueAndValidity();
				this.loadingSubject.next(false);
				// this.getAllHODs();
			},
			error => {
				const message = `Error occured`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				console.log('error', error);
				this.loadingSubject.next(false);
			}
		);
	}

	makeUserHOD() {
		this.loadingSubject.next(true);
		const userId = this.newHODForm.value.user_id;
		this.usersService.hodUser(userId).subscribe(
			response => {
				const message = `Successful`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.initNewHodForm();
				this.getAllUsers(0, 999);
				this.newHODForm.markAsPristine();
				this.newHODForm.markAsUntouched();
				this.newHODForm.updateValueAndValidity();
				this.loadingSubject.next(false);
				this.getAllHODs(this.userData._id);
				// this.getAllHODs();
			},
			error => {
				const message = `Error occured`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				console.log('error', error);
				this.loadingSubject.next(false);
			}
		);
	}

	initAddSubRoleForm(role: any = {}) {
		this.addSubRoleForm = this.fb.group({
			role: ['', Validators.required],
			report: ['', Validators.required]
		});
	}

	selectMenu(item) {
		return this.selected = item;
	}
	countRoles() {
		this.rolesService.getRolesCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}
	getAllRoles(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.rolesService.getRoles(skip, limit).subscribe(
			responseData => {
				this.roles = responseData['success'];
				console.log(this.roles);
				this.loadingSubject.next(false);
				console.log('all roles returned', this.roles);
			},
			error => {
				console.log('error', error);
			}
		);
	}

	getAllClaims() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimsService.getAllClaimTypes(0, 100).subscribe(
			responseData => {
				this.claimRoles = responseData['success'];
				console.log(this.claimRoles);
				this.loadingSubject.next(false);
				console.log('all role claims returned', this.claimRoles);
			},
			error => {
				console.log('error', error);
			}
		);
	}

	onDeleteRole(id) {
		const _title: string = 'Delete Role';
		const _description: string = 'Are you sure to permanently delete this Role?';
		const _waitDesciption: string = 'Deleting Role';
		const _deleteMessage = `Role has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.claimsService.deleteTypeRequest(id).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					// this.router.navigate(['/strada/users/claims']);
					let skip = this.pageIndex * this.limit;
					this.getAllClaims();
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}

	onDelete(id) {
		const _title: string = 'Delete Role';
		const _description: string = 'Are you sure to permanently delete this Role?';
		const _waitDesciption: string = 'Deleting Role';
		const _deleteMessage = `Role has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.rolesService.deleteRole(id).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					// this.router.navigate(['/strada/users/roles']);
					let skip = this.pageIndex * this.limit;
					this.getAllRoles(skip, this.limit);
					this.countRoles();
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
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
		this.loadingSubject.next(true);
		this.pageIndex = this.pageIndex + 1;
		let skip = this.pageIndex * this.limit;
		this.getAllRoles(skip, this.limit);
		this.loadingSubject.next(false);
		this.itemNav();
		this.countRoles();
	}

	getPrev() {
		this.loadingSubject.next(true);
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getAllRoles(skip, this.limit);
		this.loadingSubject.next(false);
		this.itemNav();
		this.countRoles();
	}

	goBack() {
		this._location.back();
	}

	removeHod(hodId) {
		const _title: string = 'Remove user as HOD';
		const _description: string = 'Are you sure to strip this user as HOD?';
		const _waitDesciption: string = 'Removing user as HOD';
		const _deleteMessage = `User is no longer an HOD`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, 'Remove as hod');
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.usersService.removehodUser(hodId).subscribe(
				response => {
					this.getAllHODs(this.userData._id);
					const message = `Successful`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
					console.log(response);
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
