// Angular
import { Component, OnInit } from '@angular/core';
import { MdTaskModel, MdTasksService } from '../../../../../core/md-tasks';
import { select, Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { currentUser, Logout, User } from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { UserService } from '../../../../../core/users';
// calender
import dayGridPlugin from '@fullcalendar/daygrid';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-users-calender',
	templateUrl: './users-calender.component.html',
	styleUrls: ['users-calender.component.scss'],
})

export class UsersBirthdayComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	calendarPlugins = [dayGridPlugin];
	myTasks = [];
	allBirthdays = [];
	events = [];
	options = ['All Tasks', 'My Tasks'];
	toggleCalender: FormGroup;
	showMyTasks = false;
	showallBirthdays = true;
	myTasksNumber = 0;
	user$: Observable<User>;
	userDetails = '';

	constructor(
		private mdTasksService: MdTasksService,
		private fb: FormBuilder,
		private _location: Location,
		private store: Store<AppState>,
		private usersService: UserService) { }

	ngOnInit(): void {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.toggleCalender = this.fb.group({
			option: ['']
		});
		this.getUsersBithdays();
	}

	goBack() {
		this._location.back();
	}

	getUsersBithdays() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.usersService.getUsersBirthday().subscribe(
			responseData => {
				this.allBirthdays = responseData['success'];
				let calObj = {};
				let allBirthdaysArray = [];
				let daysCal = this.allBirthdays;
				let thisYear = new Date();
				let year = thisYear.getFullYear();
				let dateOB;
				console.log('year', year);
				console.log('All Birthdas', this.allBirthdays);
				daysCal.forEach(birthday => {
					// birthday.dob.setFullYear(year);
					if (birthday.dob) {
						dateOB = new Date(birthday.dob);
						let eachDOB = new Date(dateOB);
						console.log('before eachDOB', eachDOB);
						dateOB.setFullYear(new Date().getFullYear());
						console.log('after eachDOB', eachDOB);
					}
					allBirthdaysArray.push({
						title: birthday.name,
						date: dateOB
					});
				});
				this.events = allBirthdaysArray;
				console.log('Tasks Calender now', allBirthdaysArray);
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			});
	}
}
