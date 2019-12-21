// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserModel, UserService } from '../../../../../core/users';
import { OrganizationModel, OrganizationsService } from '../../../../../core/organizations';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';
import * as moment from 'moment';

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

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private organizationsService: OrganizationsService,
		private fb: FormBuilder,
		private usersService: UserService
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.companyTypes = [
			{ 'label': 'Strada Media', 'value': 'Strada Media' },
			{ 'label': 'BrandMyCar', 'value': 'BrandMyCar' },
			{ 'label': 'Promovers', 'value': 'Promovers' },
			{ 'label': 'SekereNews', 'value': 'SekereNews' },
			{ 'label': 'MooveTV', 'value': 'MooveTV' },
		];
		console.log('UserEditComponent initiated');
		this.initUserForm();
		if (this.activatedRoute.snapshot.params['id']) {
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.initEditUserForm();
			this.getUserDetails().subscribe(userData => this.initEditUserForm(userData));
			this.loadingSubject.next(true);
		} else {
			this.user = this.userForm.value;
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.userForm.value);
		console.log('form control', this.userForm.controls);
		this.getOrganizations();
	}

	getOrganizations() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.organizationsService.getOrganizationsEvery().subscribe(
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

	getUserDetails() {
		return this.usersService.getUserById(this.idParams).pipe(
			map(userDetails => {
				this.user = userDetails['user'];
				this.loadingSubject.next(false);
				console.log('retrieving user with pipe', this.user);
				return this.user;
			})
		);
	}

	initEditUserForm(user: any = {}) {
		this.userForm = this.fb.group({
			name: [user.name || '', Validators.required],
			email: [user.email || '', Validators.required],
			phone: [user.phone || '', Validators.required],
			dob: [new Date(user.dob) || '', Validators.required],
			address: [user.address || '', Validators.required],
			// organization_id: ['', Validators.required],
		});
	}

	initUserForm() {
		this.userForm = this.fb.group({
			name: ['', Validators.required],
			email: ['', Validators.required],
			organization_id: ['', Validators.required],
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
		if (this.user._id) {
			console.log('User has an Id');
			let editedUser = this.userForm.value;
			console.log('User to send', editedUser);
			this.updateUser(editedUser);
			return;
		}
		this.addUser(this.userForm.value);
	}

	updateUser(user) {
		user.dob = user.dob.getTime();
		this.usersService.updateUser(user, this.user._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Updated Successfully`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/users/users']);
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
		let company = '';
		this.organizations.forEach(org => {
			if (org._id === this.userForm.value.organization_id) {
				company = org.name;
			}
		});
		const payload = {
			name: this.userForm.value.name,
			email: this.userForm.value.email,
			organization_id: this.userForm.value.organization_id,
			company: company
		};
		console.log(payload, 'edited and passsed company');
		this.usersService.createUser(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `User has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/users/users']);
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
