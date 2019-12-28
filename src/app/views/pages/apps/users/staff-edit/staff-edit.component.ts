// Angular
import { Component, OnInit } from '@angular/core';
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

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-staff-edit',
	templateUrl: './staff-edit.component.html',
	styleUrls: ['./staff-edit.component.scss']
})
export class StaffEditComponent implements OnInit {
	staff: UserModel;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldCUser: UserModel;
	staffForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	objectKeys = Object.keys;
	selectedTab: number = 0;
	selectedFile: File = null;
	idParams: string;
	fSelected;
	fileName;
	titles = ['Mrs.', 'Mr.', 'Dr.', 'Chief', 'Miss', 'Prof'];
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
		this.initUserForm();
		if (this.activatedRoute.snapshot.params['id']) {
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.initEditStaffForm();
			this.getStaffDetails().subscribe(staffData => this.initEditStaffForm(staffData));
			this.loadingSubject.next(true);
		} else {
			this.staff = this.staffForm.value;
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
	}


	getStaffDetails() {
		return this.usersService.getStaffById(this.idParams).pipe(
			map(userDetails => {
				this.staff = userDetails['data'];
				this.loadingSubject.next(false);
				console.log('retrieving staff with pipe', this.staff);
				return this.staff;
			})
		);
	}

	initEditStaffForm(staff: any = {}) {
		this.staffForm = this.fb.group({
			title: [staff.title || '', Validators.required],
			name: [staff.name || '', Validators.required],
			email: [staff.email || '', Validators.required],
			tel: [staff.tel || '', Validators.required],
			date_joined: [new Date(staff.date_joined) || '', Validators.required],
			position: [staff.position || '', Validators.required],
			summary: [staff.summary || '', Validators.required],
		});
	}

	initUserForm() {
		this.staffForm = this.fb.group({
			title: ['', Validators.required],
			name: ['', Validators.required],
			email: ['', Validators.required],
			tel: ['', Validators.required],
			date_joined: ['', Validators.required],
			position: ['', Validators.required],
			summary: ['', Validators.required],
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
		if (!this.staff || !this.staff._id) {
			result = 'Create New staff';
			return result;
		}
		result = `Edit staff -  ${this.titleCase(this.staff.name)}`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.staffForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.staffForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.staff._id) {
			console.log('staff has an Id');
			let editedUser = this.staffForm.value;
			console.log('staff to send', editedUser);
			this.updateStaff(editedUser);
			return;
		}
		this.addStaff(this.staffForm.value);
	}

	updateStaff(staff) {
		let payload = new FormData();
		payload.append('title', this.staffForm.get('title').value);
		payload.append('name', this.staffForm.get('name').value);
		payload.append('position', this.staffForm.get('position').value);
		payload.append('email', this.staffForm.get('email').value);
		payload.append('tel', this.staffForm.get('tel').value);
		payload.append('date_joined', this.staffForm.get('date_joined').value);
		payload.append('summary', this.staffForm.get('summary').value);
		if (this.fSelected) {
			payload.append('image', this.fSelected, this.fSelected.name);
		}
		this.usersService.updateStaff(payload, this.staff._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Updated Successfully`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/cdash/users/staffs']);
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
	 * Add staff
	 *
	 * @param _user: UserModel
	 * @param withBack: boolean
	 */
	addStaff(_user: UserModel) {
		this.loadingSubject.next(true);
		let payload = new FormData();
		payload.append('title', this.staffForm.get('title').value);
		payload.append('name', this.staffForm.get('name').value);
		payload.append('position', this.staffForm.get('position').value);
		payload.append('email', this.staffForm.get('email').value);
		payload.append('tel', this.staffForm.get('tel').value);
		payload.append('date_joined', this.staffForm.get('date_joined').value);
		payload.append('summary', this.staffForm.get('summary').value);
		if (this.fSelected) {
			payload.append('image', this.fSelected, this.fSelected.name);
		}
		this.usersService.createStaff(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `Staff has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/cdash/users/staffs']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	reset() {
		this.staff = Object.assign({}, this.oldCUser);
		this.initUserForm();
		this.hasFormErrors = false;
		this.staffForm.markAsPristine();
		this.staffForm.markAsUntouched();
		this.staffForm.updateValueAndValidity();
	}

	onFileChange(event) {
		if (event.target.files.length > 0) {
			this.fSelected = event.target.files[0];
			this.fileName = event.target.files[0].name;
		}
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

}
