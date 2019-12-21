// Angular
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Services and Models
import { MdTaskModel, MdTasksService } from '../../../../../core/md-tasks';

// material for table
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { merge, of as observableOf, Observable, BehaviorSubject } from 'rxjs';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-md-tasks-list',
	templateUrl: './md-tasks-list.component.html',
	styleUrls: ['./md-tasks-list.component.scss']
})
export class MdTasksListComponent implements OnInit {
	loading$: Observable<boolean>;
	DataSubject = new BehaviorSubject<any[]>([]);
	loadingSubject = new BehaviorSubject<boolean>(true);
	mdTasks: MdTaskModel[] = [];
	proceedingColumns: string[] = ['Name', 'Created On', 'Description', 'Status'];
	dataSource: any = [];
	isLoadingResults = true;
	pageIndex = 0;
	limit = 10;
	myTasks = [];
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	editedStatus;
	editedTask;
	showpart2 = false;
	showing = 'All tasks';
	statuses = ['In Progress', 'Stucked', 'Canceled', 'Completed'];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(
		private mdTasksService: MdTasksService,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.mdTasksService.getMdTasksCount('').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
				if (this.resultsLength <= 10) {
					console.log('not up to 10', this.resultsLength);
					this.disableNext = true;
				} else {
					console.log('up to 10', this.resultsLength);
					this.disableNext = false;
				}
			}
		);
		let skip = this.pageIndex * this.limit;
		this.getTasks(skip, this.limit);
		this.mdTasksService.getMyTasksCount().subscribe(
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
		this.getMyTasks(skip, this.limit);
	}

	getTasksCount() {
		this.mdTasksService.getMdTasksCount('').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}

	showTable(table) {
		this.showing = table;
	}

	getTasks(skip, limit) {
		this.mdTasksService.getMdTasks(skip, limit, '').subscribe(
			responseData => {
				this.mdTasks = responseData['success'];
				this.dataSource = new MatTableDataSource<MdTaskModel>(this.mdTasks);
				this.loadingSubject.next(false);
				console.log('all md-tasks returned', this.mdTasks);
			},
			error => {
				console.log('error', error);
				this.loadingSubject.next(false);
			});
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
		this.getTasksCount();
		this.getMytasksCount();
		this.getMyTasks(skip, this.limit);
		this.getTasks(skip, this.limit);
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		this.getTasksCount();
		let skip = this.pageIndex * this.limit;
		this.getTasks(skip, this.limit);
		this.getMytasksCount();
		this.getMyTasks(skip, this.limit);
		this.itemNav();
	}


	getTaskDetails(id) {
		this.loadingSubject.next(true);
		this.mdTasksService.getMdTaskById(id).subscribe(
			responseData => {
				this.editedTask = responseData;
			},
			error => {
				console.log('error occures', error);
			}
		);
	}

	updateTask(task, id) {
		this.mdTasksService.updateMdTask(task, id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				const skip = this.pageIndex * this.limit;
				this.getTasks(skip, this.limit);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	changed(status, taskId) {
		this.loadingSubject.next(true);
		this.getTaskDetails(taskId);
		this.updateTask({ status }, taskId);
		this.loadingSubject.next(false);
	}

	getMytasksCount() {
		this.mdTasksService.getMyTasksCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}
	getMyTasks(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.mdTasksService.getMyTasks(skip, limit).subscribe(
			responseData => {
				this.myTasks = responseData['success'];
				this.dataSource = new MatTableDataSource<MdTaskModel>(this.myTasks);
				this.loadingSubject.next(false);
				console.log('all md-tasks returned', this.myTasks);
			},
			error => {
				console.log('error', error);
			});
	}
}
