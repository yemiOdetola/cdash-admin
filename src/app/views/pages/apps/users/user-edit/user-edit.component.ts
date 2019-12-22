// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserModel, UserService } from '../../../../../core/users';
import { RolesService } from '../../../../../core/roles';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-user-edit',
	templateUrl: './user-edit.component.html',
	styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {
	user: UserModel;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldCUser: UserModel;
	userForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	objectKeys = Object.keys;
	companyTypes: any;
	organizations;
	selectedTab: number = 0;
	selectedFile: File = null;
	idParams: string;
	good: string;
	roles: any[];
	changePassword = false;
	userTypes = [
		{ 'label': 'Admin level user', 'value': 'admin' },
		{ 'label': 'Normal user', 'value': 'user' }
	];
	constructor(
		private rolesService: RolesService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private fb: FormBuilder,
		private usersService: UserService
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		console.log('UserEditComponent initiated');
		this.initUserForm();
		this.getAllRoles(0, 999);
		if (this.activatedRoute.snapshot.paramMap.get['managepassword']) {
			this.changePassword = true;
			console.log(this.changePassword);
			this.initPasswordChangeForm();
		}
		if (this.activatedRoute.snapshot.params['id']) {
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.initEditUserForm();
			this.getUserDetails().subscribe(userData => this.initEditUserForm(userData));
			this.loadingSubject.next(true);
		} else {
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.userForm.value);
		console.log('form control', this.userForm.controls);
	}

	getAllRoles(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.rolesService.getRoles(skip, limit).subscribe(
			responseData => {
				this.roles = responseData['data'];
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			}
		);
	}

	getUserDetails() {
		return this.usersService.getUserById(this.idParams).pipe(
			map(userDetails => {
				this.user = userDetails['data'];
				this.loadingSubject.next(false);
				console.log('retrieving user with pipe', this.user);
				return this.user;
			})
		);
	}

	initEditUserForm(user: any = {}) {
		this.userForm = this.fb.group({
			name: [user.name || '', Validators.required],
			type: [user.type || '', Validators.required],
			password: [user.password || '', Validators.required],
			role: [user.role || '', Validators.required],
		});
	}

	initPasswordChangeForm() {
		this.userForm = this.fb.group({
			password: ['', Validators.required],
			confirm_password: ['', Validators.required]
		});
	}

	initUserForm() {
		this.userForm = this.fb.group({
			name: ['', Validators.required],
			email: ['', Validators.required],
			type: ['', Validators.required],
			password: ['', Validators.required],
			role: ['', Validators.required],
		});
	}

	titleCase(str: any) {
		let splitStr = str.toLowerCase().split(' ');
		for (let i = 0; i < splitStr.length; i++) {
			splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
		}
		return splitStr.join(' ');
	}

	getComponentTitle() {
		let result = 'Please Wait';
		if (!this.user || !this.user._id) {
			result = 'Create New User';
			return result;
		}
		result = `Edit User -  ${this.titleCase(this.user.name)}`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.userForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.userForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.idParams) {
			let editedUser = this.userForm.value;
			this.updateUser(editedUser);
			return;
		}
		this.addUser(this.userForm.value);
	}

	updateUser(user) {
		this.usersService.updateUser(user, this.user._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Updated Successfully`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/cdash/users/users']);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}
	/**
	 * Add User
	 *
	 * @param _user: UserModel
	 * @param withBack: boolean
	 */
	addUser(_user: UserModel) {
		this.loadingSubject.next(true);
		const payload = {
			name: this.userForm.value.name,
			email: this.userForm.value.email,
			role: this.userForm.value.role,
			password: this.userForm.value.password,
			type: this.userForm.value.type
		};
		console.log(payload, 'edited and passsed company');
		this.usersService.createUser(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				if (data.status === false) {
					return this.layoutUtilsService.showActionNotification(data.msg, MessageType.Create, 10000, true, true);
				}
				const message = `User has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/cdash/users/users']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	reset() {
		this.user = Object.assign({}, this.oldCUser);
		this.initUserForm();
		this.hasFormErrors = false;
		this.userForm.markAsPristine();
		this.userForm.markAsUntouched();
		this.userForm.updateValueAndValidity();
	}
	/**
	 * Close alert
	 *
	 * @param $event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() { }

}
