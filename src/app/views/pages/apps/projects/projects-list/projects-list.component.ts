// Angular
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { ProjectModel, ProjectsService } from '../../../../../core/projects';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';

// material for table
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-projects-list',
	templateUrl: './projects-list.component.html',
	styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	projects: ProjectModel[] = [];
	proceedingColumns: string[] = ['Name', 'Description', 'Created On', 'Status'];
	dataSource = new MatTableDataSource<ProjectModel>(this.projects);
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	editedProject;
	statuses = [
		'Initialized', 'Running', 'terminated', 'Completed', 'Extended', 'Report sent'
	];
	constructor(
		private projectsService: ProjectsService,
		private layoutUtilsService: LayoutUtilsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.projectsService.getProjectsCount('').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if ( this.resultsLength <= 10) {
					console.log('not up to 10', this.resultsLength);
					this.disableNext = true;
				} else {
					console.log('up to 10', this.resultsLength);
					this.disableNext = false;
				}
			}
		);
		let skip = this.pageIndex * this.limit;
		this.getProjects(skip, this.limit);
	}

	projectsCount() {
		this.loadingSubject.next(true);
		this.projectsService.getProjectsCount('').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}

	getProjects(skip, limit) {
		this.loadingSubject.next(true);
		this.projectsService.getProjects(skip, limit,'').subscribe(
			responseData => {
				this.projects = responseData['success'];
				this.dataSource = new MatTableDataSource<ProjectModel>(this.projects);
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			}
		);
	}
	itemNav() {
		if (((this.pageIndex * 10) + 10) >= this.resultsLength) {
			this.disableNext = true;
			console.log('paste total numbers');
			// return;
		} else {
			this.disableNext = false;
		}
		if (this.pageIndex === 0) {
			this.disablePrev = true;
			console.log('last page');
			// return;
		} else {
			this.disablePrev = false;
		}
	}
	getNext() {
		this.pageIndex = this.pageIndex + 1;
		let skip = this.pageIndex * this.limit;
		this.getProjects(skip, this.limit);
		this.projectsCount();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getProjects(skip, this.limit);
		this.projectsCount();
		this.itemNav();
	}

	getProjectDetails(id) {
		this.loadingSubject.next(true);
		this.projectsService.getProjectById(id).subscribe(
			responseData => {
				this.editedProject = responseData;
			},
			error => {
				console.log('error occures', error);
			}
		);
	}

	updateTask(project, id) {
		this.projectsService.updateProject(project, id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				const skip = this.pageIndex * this.limit;
				this.getProjects(skip, this.limit);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	changed(status, projectId) {
		this.loadingSubject.next(true);
		this.getProjectDetails(projectId);
		this.updateTask({status}, projectId);
		this.loadingSubject.next(false);
	}

	ngOnDestroy() { }
}
