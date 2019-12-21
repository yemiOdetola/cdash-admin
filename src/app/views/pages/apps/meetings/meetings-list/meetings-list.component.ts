// Angular
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { MeetingModel, MeetingsService } from '../../../../../core/meetings';

// material for table
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-meetings-list',
	templateUrl: './meetings-list.component.html',
	styleUrls: ['./meetings-list.component.scss']
})
export class MeetingsListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	meetings: MeetingModel[] = [];
	proceedingColumns: string[] = ['Client', 'Duration', 'Start', 'Description', 'Type'];
	dataSource = new MatTableDataSource<MeetingModel>(this.meetings);
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	constructor(private meetingsService: MeetingsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		let skip = this.pageIndex * this.limit;
		this.getMeetings(skip, this.limit);
		this.meetingsService.getMeetingsCount('').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if ( this.resultsLength <= 10) {
					this.disableNext = true;
				} else {
					this.disableNext = false;
				}
			}
		);
	}

	getMeetings(skip, limit) {
		this.loadingSubject.next(true);
		this.meetingsService.getMeetings(skip, limit,'').subscribe(
			responseData => {
				this.meetings = responseData['success'];
				this.dataSource = new MatTableDataSource<MeetingModel>(this.meetings);
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			}
		);
	}
	countMeetings() {
		this.loadingSubject.next(true);
		this.meetingsService.getMeetingsCount('').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
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
		this.getMeetings(skip, this.limit);
		this.countMeetings();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getMeetings(skip, this.limit);
		this.countMeetings();
		this.itemNav();
	}

	ngOnDestroy() { }
}
