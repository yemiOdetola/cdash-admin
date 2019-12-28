// Angular
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { ProjectsService } from '../../../../../core/projects';


@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-logs',
	templateUrl: './logs.component.html',
	styleUrls: ['./logs.component.scss']
})
export class AllLogsComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	logs: any[] = [];
	pageIndex = 0;
	limit = 20;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	editedProject;
	constructor(
		private projectsService: ProjectsService,) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		let skip = this.pageIndex * this.limit;
		this.getLogs(skip, this.limit);
	}

	getLogsCount() {
		this.loadingSubject.next(true);
		this.projectsService.getLogsCount().subscribe(
			countResult => {
				this.resultsLength = countResult['data'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}

	getLogs(skip, limit) {
		this.loadingSubject.next(true);
		this.projectsService.getLogs(skip, limit).subscribe(
			responseData => {
				this.logs = responseData['data'];
				console.log('looooooooogs', this.logs);
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			}
		);
	}

	itemNav() {
		if (((this.pageIndex * 20) + 20) >= this.resultsLength) {
			this.disableNext = true;
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
		this.getLogs(skip, this.limit);
		this.getLogsCount();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getLogs(skip, this.limit);
		this.getLogsCount();
		this.itemNav();
	}

	ngOnDestroy() { }
}
