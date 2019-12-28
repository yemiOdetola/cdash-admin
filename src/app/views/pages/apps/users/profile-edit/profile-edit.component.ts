// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserService } from '../../../../../core/users';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-profile-edit',
	templateUrl: './profile-edit.component.html',
	styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit, OnDestroy {
	user: any;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	profileForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	idParams = '';
	errorMessage = 'Oops! Form is not filled correctly. Change a few things up and try submitting again.';
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private fb: FormBuilder,
		private usersService: UserService
	) { }

	ngOnInit() {
		this.idParams = localStorage.getItem('loginId');
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.initEditUserForm();
		this.getUserDetails().subscribe(userData => this.initEditUserForm(userData));
		this.loadingSubject.next(true);
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
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
		this.profileForm = this.fb.group({
			name: [user.name || '', Validators.required],
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
		result = `Edit profile -  ${this.titleCase(this.user.name)}`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.profileForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.profileForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			return;
		}
		let editedUser = this.profileForm.value;
		this.updateUser();
		return;
	}

	updateUser() {
		if (this.profileForm.get('password').value !== this.profileForm.get('confirm_password').value) {
			this.hasFormErrors = true;
			return this.errorMessage = 'Password does not match';
		}
		const payload = {
			user: this.idParams,
			name: this.profileForm.get('name').value,
			password: this.profileForm.get('password').value
		};
		this.usersService.profileEdit(payload).subscribe(
			data => {
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

	reset() {
		this.user = Object.assign({}, this.user);
		this.hasFormErrors = false;
		this.profileForm.markAsPristine();
		this.profileForm.markAsUntouched();
		this.profileForm.updateValueAndValidity();
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
