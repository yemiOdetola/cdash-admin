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
	selector: 'kt-password-edit',
	templateUrl: './password-edit.component.html',
	styleUrls: ['./password-edit.component.scss']
})
export class PasswordEditComponent implements OnInit, OnDestroy {
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
		this.initPasswordChangeForm();
		if (this.activatedRoute.snapshot.params['id']) {
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.userForm.value);
		console.log('form control', this.userForm.controls);
		this.loadingSubject.next(false);
	}
	initPasswordChangeForm() {
		this.userForm = this.fb.group({
			password: ['', Validators.required],
			confirm_password: ['', Validators.required]
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
		result = `Manage password`;
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
		this.updatePassword(this.userForm.value);
	}
	/**
	 * Add User
	 *
	 * @param _user: UserModel
	 * @param withBack: boolean
	 */
	updatePassword(_user) {
		this.loadingSubject.next(true);
		if (this.userForm.value.password !== this.userForm.value.confirm_password) {
			this.loadingSubject.next(false);
			return this.layoutUtilsService.showActionNotification('Passwords does not match.', MessageType.Create, 10000, true, true);
		}
		const payload = {
			user: this.idParams,
			password: this.userForm.value.password
		};
		this.usersService.updatePassword(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				if (data.status === false) {
					return this.layoutUtilsService.showActionNotification(data.msg, MessageType.Create, 10000, true, true);
				}
				const message = `User's password has been updated Created`;
				this.layoutUtilsService.showActionNotification(data.msg, MessageType.Create, 10000, true, true);
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
		this.initPasswordChangeForm();
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
