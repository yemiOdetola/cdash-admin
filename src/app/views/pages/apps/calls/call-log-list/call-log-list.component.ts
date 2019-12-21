// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { CallLogModel, CallsService } from '../../../../../core/calls';

// material for table
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
	selector: 'kt-call-log-list',
	templateUrl: './call-log-list.component.html',
	styleUrls: ['./call-log-list.component.scss']
})
export class CallLogListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	calls: CallLogModel[];
	proceedingColumns: string[] = ['Name', 'Phone Number', 'Type', 'Source', 'Location', 'Updated On'];
	dataSource: any;
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	constructor(private callsService: CallsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.callsService.getCallLogsCount().subscribe(
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
		this.getCallLogs(skip, this.limit);
	}

	countCallLogs() {
		this.callsService.getCallLogsCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
				if ( this.resultsLength <= 10) {
					console.log('not up to 10', this.resultsLength);
					this.disableNext = true;
				} else {
					console.log('up to 10', this.resultsLength);
					this.disableNext = false;
				}
			}
		);
	}

	getCallLogs(skip, limit) {
		this.callsService.getCallLogs(skip, limit).subscribe(
			responseData => {
				this.calls = responseData['success'];
				this.dataSource = new MatTableDataSource<CallLogModel>(this.calls);
				this.loadingSubject.next(false);
				console.log('all calls returned', this.calls);
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
		let skip = this.pageIndex * this.limit;
		this.getCallLogs(skip, this.limit);
		this.countCallLogs();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getCallLogs(skip, this.limit);
		this.countCallLogs();
		this.itemNav();
	}

	ngOnDestroy() { }
}
