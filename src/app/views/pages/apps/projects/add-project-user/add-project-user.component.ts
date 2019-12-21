// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { ProjectUserModel, ProjectsService } from '../../../../../core/projects';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-add-project-user',
	templateUrl: './add-project-user.component.html',
	styleUrls: ['./add-project-user.component.scss']
})
export class AddProjectUserComponent implements OnInit, OnDestroy {
	projectUser: ProjectUserModel;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	projectUserForm: FormGroup;
	oldProjectUSer: ProjectUserModel;
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
		private projectsService: ProjectsService
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
		this.projectUser = this.projectUserForm.value;
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.projectUserForm.value);
		console.log('form control', this.projectUserForm.controls);
	}

	getUsers() {
		this.projectsService.getUsers().subscribe(
			myusers => {
				this.users = myusers['success'];
				this.loadingSubject.next(false);
				console.log('users', this.users);
			}
		);
	}

	initAddUserForm(project: any = {}) {
		this.projectUserForm = this.fb.group({
			user: ['', Validators.required]
		});
	}

	getComponentTitle() {
		let result = `Add New User to Project`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.projectUserForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.projectUserForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		this.addUser(this.projectUserForm.value);
	}
	/**
	 * Add AddUser
	 *
	 * @param _project: AddUserModel
	 * @param withBack: boolean
	 */
	addUser(_project) {
		this.loadingSubject.next(true);
		let payload = {};
		const project_id = this.idParams;
		const name = _project.user;
		let user_id = '';
		this.users.forEach(user => {
			if (user.name === _project.user) {
				user_id = user._id;
			}
		});
		payload = { ...payload, project_id, user_id, name };
		console.log(payload);
		this.projectsService.addUserToProject(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `Successfully Added`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate([`/strada/projects/project/${this.idParams}`]);
			}, error => {
				console.log('error.error', error.error['error']);
				if (error.error['error'] === 'Error: Duplicate Project User') {
					this.layoutUtilsService.showActionNotification('This User has already been added!', MessageType.Create, 10000, true, true);
				} else {
					this.loadingSubject.next(false);
					console.log('Error response', error);
					const title = 'Please Retry';
					const message = 'Sorry, Temporary Error Occured';
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				}
			});
	}

	reset() {
		this.projectUser = Object.assign({}, this.oldProjectUSer);
		this.initAddUserForm();
		this.hasFormErrors = false;
		this.projectUserForm.markAsPristine();
		this.projectUserForm.markAsUntouched();
		this.projectUserForm.updateValueAndValidity();
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
