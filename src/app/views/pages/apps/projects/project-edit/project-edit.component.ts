// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { ProjectModel, ProjectsService } from '../../../../../core/projects';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';
// imprts for date hiccup
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';

const moment = _moment;

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-project-edit',
	templateUrl: './project-edit.component.html',
	styleUrls: ['./project-edit.component.scss'],
	providers: [
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
	],
})
export class ProjectEditComponent implements OnInit, OnDestroy {
	project: ProjectModel;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldCProject: ProjectModel;
	projectForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	selectedFile: File = null;
	idParams: string;
	statuses = [
		'Initialized', 'Running', 'terminated', 'Completed', 'Extended', 'Report sent'
	];
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
		this.emptyProjectForm();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getProjectDetails().subscribe(projectData => this.initProjectForm(projectData));
			this.loadingSubject.next(true);
		} else {
			this.project = this.projectForm.value;
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.projectForm.value);
		console.log('form control', this.projectForm.controls);
	}

	getProjectDetails() {
		return this.projectsService.getProjectById(this.idParams).pipe(
			map(projectDetails => {
				this.project = projectDetails['success'];
				this.loadingSubject.next(false);
				console.log('retrieving project with pipe', this.project);
				return this.project;
			})
		);
	}

	emptyProjectForm() {
		this.projectForm = this.fb.group({
			description: ['', Validators.required],
			name: ['', Validators.required],
			duration: [''],
			status: ['', Validators.required],
			start: ['', Validators.required],
			end: ['', Validators.required],
		});
	}

	initProjectForm(project: any = {}) {
		let startDate = moment(project.start).format('YYYY-MM-DD');
		let endDate = moment(project.end).format('YYYY-MM-DD');
		this.projectForm = this.fb.group({
			description: [project.description || '', Validators.required],
			name: [project.name || '', Validators.required],
			duration: [project.duration || ''],
			status: [project.status || ''],
			start: [startDate || '', Validators.required],
			end: [endDate || '', Validators.required],
		});
	}

	convertDate(tzDate) {
		let d = new Date(tzDate);
		const year = d.getFullYear();
		const month = d.getMonth();
		const day = d.getDate();
		return `${year}-${month + 1}-${day}`;
	}

	getComponentTitle() {
		let result = 'Please Wait';
		if (!this.project || !this.project._id) {
			result = 'Create New Project';
			return result;
		}
		result = `Edit Project Description`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.projectForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.projectForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.project && this.project._id) {
			console.log('Project has an Id');
			let editedProject = this.projectForm.value;
			console.log('Project to send', editedProject);
			this.updateProject(editedProject);
			return;
		}
		this.addProject(this.projectForm.value);
	}

	updateProject(project) {
		const start = moment(this.projectForm.value.start).valueOf();
		const end = moment(this.projectForm.value.end).valueOf();
		const remixedPayload = {
			name: project.name,
			description: project.description,
			start: start,
			end: end,
			duration: project.duration
		};
		this.projectsService.updateProject(remixedPayload, this.project._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Updated Successfully`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/projects/projects']);
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
	 * Add Project
	 *
	 * @param _project: ProjectModel
	 * @param withBack: boolean
	 */
	addProject(_project: ProjectModel) {
		this.loadingSubject.next(true);
		this.projectForm.patchValue({
			start: moment(this.projectForm.value.start).valueOf(),
			end: moment(this.projectForm.value.end).valueOf()
		});
		const payload = this.projectForm.value;
		console.log(payload);
		this.projectsService.createProject(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `Project has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/projects/projects']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	reset() {
		this.project = Object.assign({}, this.oldCProject);
		this.initProjectForm();
		this.hasFormErrors = false;
		this.projectForm.markAsPristine();
		this.projectForm.markAsUntouched();
		this.projectForm.updateValueAndValidity();
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
