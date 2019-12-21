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

@Component({
	selector: 'kt-task-calender',
	templateUrl: './task-calender.component.html',
	styleUrls: ['task-calender.component.scss'],
})
export class TaskCalenderComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	calendarPlugins = [dayGridPlugin];
	myTasks = [];
	allTasks = [];
	events = [];
	options = ['All Tasks', 'My Tasks'];
	toggleCalender: FormGroup;
	showMyTasks = false;
	showAllTasks = true;
	myTasksNumber = 0;
	user$: Observable<User>;
	userDetails: any;

	constructor(
		private mdTasksService: MdTasksService,
		private fb: FormBuilder,
		private store: Store<AppState>,
		private usersService: UserService) { }

	ngOnInit(): void {
		this.loading$ = this.loadingSubject.asObservable();
		this.user$ = this.store.pipe(select(currentUser));
		this.user$.subscribe(
			userData => {
				this.getUserDetails(userData['_id']);
			}
		);
		this.toggleCalender = this.fb.group({
			option: ['']
		});
		this.getMyTasksEvery();
	}


	getAllTasks() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.mdTasksService.getMdTasksEvery().subscribe(
			responseData => {
				this.allTasks = responseData['success'];
				let calObj = {};
				let allTaskArray = [];
				let tasksCal = this.allTasks;
				tasksCal.forEach(task => {
					allTaskArray.push({
						title: task.name,
						date: task.created_at
					});
				});
				this.events = allTaskArray;
				// for (let i = 0; i < this.allTasks.length; i++) {
				// 	calObj['title'] = tasksCal[i].name;
				// 	calObj['date'] = tasksCal[i].created_at;
				// 	allTaskArray.push(calObj);
				// 	console.log('allTaskArray', allTaskArray);
				// }
				console.log('Tasks Calender now', allTaskArray);
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			});
	}

	getMyTasksEvery() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.mdTasksService.getMyTaskEvery().subscribe(
			responseData => {
				this.allTasks = responseData['success'];
				let calObj = {};
				let allTaskArray = [];
				let tasksCal = this.allTasks;
				tasksCal.forEach(task => {
					allTaskArray.push({
						title: task.name,
						date: task.created_at
					});
				});
				this.events = allTaskArray;
				// for (let i = 0; i < this.allTasks.length; i++) {
				// 	calObj['title'] = tasksCal[i].name;
				// 	calObj['date'] = tasksCal[i].created_at;
				// 	allTaskArray.push(calObj);
				// 	console.log('allTaskArray on init', allTaskArray);
				// }
				console.log('Tasks Calender now', allTaskArray);
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			});
	}

	getUserDetails(id) {
		this.loadingSubject.next(true);
			this.usersService.getUserById(id).subscribe(
			singleUser => {
				this.userDetails = singleUser['user'];
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
	}

	toggleCal(e) {
		if (this.toggleCalender.value.option === 'All Tasks') {
			this.getAllTasks();
		}
		if (this.toggleCalender.value.option === 'My Tasks') {
			this.getMyTasksEvery();
		}
	}
}
