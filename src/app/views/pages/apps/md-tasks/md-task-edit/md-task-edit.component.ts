// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { MdTaskModel, MdTasksService } from '../../../../../core/md-tasks';
import { currentUser, Logout, User } from '../../../../../core/auth';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';

const moment = _moment;

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-md-task-edit',
	templateUrl: './md-task-edit.component.html',
	styleUrls: ['./md-task-edit.component.scss'],
	providers: [
		{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
		{provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
	],
})
export class MdTaskEditComponent implements OnInit, OnDestroy {
	mdTask: MdTaskModel;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldMdTask: MdTaskModel;
	mdTaskForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	selectedFile: File = null;
	idParams: string;
	users;
	myId;
	user$: Observable<User>;
	taskStatuses = ['In Progress', 'Stucked', 'Canceled', 'Completed'];
	switchInstruction = true;
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private mdTasksService: MdTasksService,
		private store: Store<AppState>,
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.emptyTaskForm();
		this.getUsers();
		this.user$ = this.store.pipe(select(currentUser));
		this.user$.subscribe(user => {
			this.myId = user['_id'];
			console.log('myId in this', this.myId);
			console.log('All user data', user);
		});
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getMdTaskDetails().subscribe(mdTaskData => this.initMdTaskForm(mdTaskData));
			this.loadingSubject.next(true);
		} else {
			this.mdTask = this.mdTaskForm.value;
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.mdTaskForm.value);
		console.log('form control', this.mdTaskForm.controls);
	}

	getUsers() {
		this.loadingSubject.next(true);
		this.mdTasksService.getUsers().subscribe(
			myusers => {
				this.users = myusers['success'];
				this.users.unshift({name: 'Add My task', _id: this.myId} );
				this.loadingSubject.next(false);
				console.log('users', this.users);
			}
		);
	}

	getMdTaskDetails() {
		return this.mdTasksService.getMdTaskById(this.idParams).pipe(
			map(mdTaskDetails => {
				this.mdTask = mdTaskDetails['success'];
				this.loadingSubject.next(false);
				console.log('retrieving mdTasks with pipe', this.mdTask);
				return this.mdTask;
			})
		);
	}
	emptyTaskForm(task: any = {}) {
		this.mdTaskForm = this.fb.group({
			name: ['', Validators.required],
			user_id: ['', Validators.required],
			start: ['', Validators.required],
			description: ['', Validators.required],
			status: ['']
		});
	}

	initMdTaskForm(mdTask: any = {}) {
		let startDate = moment(mdTask.start).format('YYYY-MM-DD');
		this.mdTaskForm = this.fb.group({
			name: [mdTask.name || '', Validators.required],
			start: [startDate || '', Validators.required],
			status: [mdTask.status || ''],
			description: [mdTask.description || ''],
		});
	}

	getComponentTitle() {
		let result = 'Please Wait';
		if (!this.mdTask || !this.mdTask._id) {
			result = 'Create New Task';
			return result;
		}
		result = `Edit Task -  ${this.mdTask.name}`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.mdTaskForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.mdTaskForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.mdTask._id) {
			console.log('MdTask has an Id');
			let editedMdTask = this.mdTaskForm.value;
			this.updateMdTask(editedMdTask);
			return;
		}
		this.addMdTask(this.mdTaskForm.value);
	}

	updateMdTask(mdTask) {
		const start = moment(this.mdTaskForm.value.start).valueOf();
		const description = this.mdTaskForm.value.description;
		const name = this.mdTaskForm.value.name;
		const status = this.mdTaskForm.value.status;
		let payloadVal = {};
		payloadVal = { ...payloadVal, name, description, status, start };
		console.log('payloadVal', payloadVal);
		this.mdTasksService.updateMdTask(payloadVal, this.mdTask._id).subscribe(
			data => {
				if (data['success']) {
					console.log('success reponse', data);
					this.loadingSubject.next(false);
					const message = `New MD\'s Task has been Successfully Updated`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
					this.router.navigate(['/strada/md-tasks/md-tasks']);
				}
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	timeStringToFloat(time) {
		let hoursMinutes = time.split(/[.:]/);
		let hours = parseInt(hoursMinutes[0], 10);
		let minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
		let total = (hours + minutes / 60).toFixed(2);
		return total;
	}
	/**
	 * Add MdTask
	 *
	 * @param _mdTask: MdTaskModel
	 * @param withBack: boolean
	 */
	addMdTask(_mdTask: MdTaskModel) {
		this.loadingSubject.next(true);
		// const start = moment(this.mdTaskForm.value.start).valueOf();
		const prepStart = new Date(this.mdTaskForm.value.start);
		const start = prepStart.getTime();
		const description = this.mdTaskForm.value.description;
		const name = this.mdTaskForm.value.name;
		const user_id = this.mdTaskForm.value.user_id;
		let payloadVal = {};
		payloadVal = { ...payloadVal, name, description, start, user_id };
		console.log('payloadVal', payloadVal);

		this.mdTasksService.createMdTask(payloadVal).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `New MD\'s Task has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/md-tasks/md-tasks']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	reset() {
		this.mdTask = Object.assign({}, this.oldMdTask);
		this.initMdTaskForm();
		this.hasFormErrors = false;
		this.mdTaskForm.markAsPristine();
		this.mdTaskForm.markAsUntouched();
		this.mdTaskForm.updateValueAndValidity();
	}
	/**
	 * Close alert
	 *
	 * @param $event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	toggleInstruction() {
		this.switchInstruction = !this.switchInstruction;
	}

	ngOnDestroy() { }

}
