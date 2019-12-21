import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingModel, MeetingsService } from '../../../../../core/meetings';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-meeting',
	templateUrl: './meeting.component.html',
	styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	meetingId: string;
	meetingDetails: any;
	attendants = [];
	pageTitle = 'Please wait...';
	addnew = false;
	users = [];
	userFormDisplay = false;
	meetingUserForm: FormGroup;
	constructor(
		private route: ActivatedRoute,
		private meetingsService: MeetingsService,
		private layoutUtilsService: LayoutUtilsService,
		private _location: Location,
		private fb: FormBuilder,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.meetingId = this.route.snapshot.params['id'];
		this.initUsersForm();
		this.getAllUsers();
		this.getMeeting();
		this.getMeetingAttenders();
		console.log('id returned', this.route.snapshot.params['id']);
	}

	goBack() {
		this._location.back();
	}

	getMeeting() {
		this.meetingsService.getMeetingById(this.meetingId).subscribe(
			singleData => {
				this.meetingDetails = singleData['success'];
				console.log('this meeting details oninit', this.meetingDetails);
				this.loadingSubject.next(false);
				this.pageTitle = `Meeting Details`;
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
	}

	showNewUserForm() {
		this.userFormDisplay = !this.userFormDisplay;
	}

	initUsersForm() {
		this.meetingUserForm = this.fb.group({
			user: ['', Validators.required]
		});
	}

	toggleAdd() {
		return this.addnew = !this.addnew;
	}

	getAllUsers() {
		this.meetingsService.getUsers().subscribe(
			myusers => {
				this.users = myusers['success'];
				console.log('users', this.users);
			}
		);
	}

	addUser() {
		let formData = this.meetingUserForm.value;
		this.loadingSubject.next(true);
		let payload = {};
		const meeting_id = this.meetingDetails._id;
		let user_id = '';
		const name = formData.user;
		this.users.forEach(user => {
			if (user.name === formData.user) {
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
				this.getMeeting();
			}, error => {
				this.loadingSubject.next(false);
				console.log('error.error.error', error.error.error);
				if (error.error.error === 'Error: Duplicate Meeting User') {
					this.layoutUtilsService.showActionNotification('This User has already been added!', MessageType.Create, 10000, true, true);
				} else {
					console.log('Error response', error);
					const title = 'Please Retry';
					const message = 'Sorry, Temporary Error Occured';
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				}
			});
	}

	onDelete() {
		const _title: string = 'Delete Meeting';
		const _description: string = 'Are you sure to permanently delete this Meeting?';
		const _waitDesciption: string = 'Deleting Meeting';
		const _deleteMessage = `Meeting has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.meetingsService.deleteMeeting(this.meetingId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/strada/meetings/meetings']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}

	getMeetingAttenders() {
		this.meetingsService.getMeetingUsers(this.meetingId).subscribe(
			meetingUsers => {
				this.attendants = meetingUsers['success'];
			},
			error => {
				console.log('error occured', error);
			}
		);
	}

	deleteUser(attender) {
		const _title: string = 'Remove User from Meeting';
		const _description: string = 'Are you sure to remove this User?';
		const _waitDesciption: string = 'Removing User';
		const _deleteMessage = `User has been Removed`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.meetingsService.deleteUserFromMeeting(attender._id).subscribe(
				deleted => {
					this.loadingSubject.next(true);
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.getMeetingAttenders();
					this.loadingSubject.next(false);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
					this.loadingSubject.next(false);
				}
			);
		});
	}
}
