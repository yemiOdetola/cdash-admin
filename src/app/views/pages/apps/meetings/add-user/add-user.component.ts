// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { MeetingUserModel, MeetingsService } from '../../../../../core/meetings';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-add-user',
	templateUrl: './add-user.component.html',
	styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {
	meetingUser: MeetingUserModel;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	meetingUserForm: FormGroup;
	oldMeetingUSer: MeetingUserModel;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	users = [];
	idParams: string = '';
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private meetingsService: MeetingsService
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.initAddUserForm();
		this.getUsers();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		this.meetingUser = this.meetingUserForm.value;
		this.loadingSubject.next(false);
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.meetingUserForm.value);
		console.log('form control', this.meetingUserForm.controls);
	}

	getUsers() {
		this.meetingsService.getUsers().subscribe(
			myusers => {
				this.users = myusers['success'];
				console.log('users', this.users);
			}
		);
	}

	initAddUserForm(meeting: any = {}) {
		this.meetingUserForm = this.fb.group({
			user: ['', Validators.required]
		});
	}

	getComponentTitle() {
		let result = `Add New User to Meeting`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.meetingUserForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.meetingUserForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		this.addUser(this.meetingUserForm.value);
	}
	/**
	 * Add AddUser
	 *
	 * @param _meeting: AddUserModel
	 * @param withBack: boolean
	 */
	addUser(_meeting) {
		this.loadingSubject.next(true);
		let payload = {};
		const meeting_id = this.idParams;
		let user_id = '';
		const name = _meeting.user;
		this.users.forEach(user => {
			if (user.name === _meeting.user) {
				user_id = user._id;
			}
		});
		payload = {...payload, meeting_id, user_id, name};
		console.log(payload);
		this.meetingsService.addUserToMeeting(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `Successfully Added`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate([`/strada/meetings/meetings/${this.idParams}`]);
			}, error => {
				if (error.error.error === 'Error: Duplicate Meeting User') {
					this.layoutUtilsService.showActionNotification('This User has already been added!', MessageType.Create, 10000, true, true);
				}
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	reset() {
		this.meetingUser = Object.assign({}, this.oldMeetingUSer);
		this.initAddUserForm();
		this.hasFormErrors = false;
		this.meetingUserForm.markAsPristine();
		this.meetingUserForm.markAsUntouched();
		this.meetingUserForm.updateValueAndValidity();
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
