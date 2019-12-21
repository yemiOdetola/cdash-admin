// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { MdTaskModel, MdTasksService } from '../../../../../core/md-tasks';

// material for table
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog, MatDialogConfig } from '@angular/material';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-my-tasks',
	templateUrl: './my-tasks.component.html',
	styleUrls: ['./my-tasks.component.scss']
})
export class MyTasksComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	myTasks: MdTaskModel[];
	proceedingColumns: string[] = ['Name', 'Created On', 'Description', 'Status'];
	dataSource: any;
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	editedTask;
	editedStatus;
	statuses = ['In Progress', 'Stucked', 'Cancel', 'Completed'];
	constructor(
		private mdTasksService: MdTasksService,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		let skip = this.pageIndex * this.limit;
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
		this.getMytasksCount();
		let skip = this.pageIndex * this.limit;
		this.getMyTasks(skip, this.limit);
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		this.getMytasksCount();
		let skip = this.pageIndex * this.limit;
		this.getMyTasks(skip, this.limit);
		this.itemNav();
	}

	getTaskDetails(id) {
		this.loadingSubject.next(true);
		this.mdTasksService.getMyTaskById(id).subscribe(
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
				this.getMyTasks(skip, this.limit);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	changed(status, id) {
		this.loadingSubject.next(true);
		this.getTaskDetails(id);
		this.updateTask({status}, id);
		this.loadingSubject.next(false);
	}
}
