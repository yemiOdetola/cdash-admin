// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
// Services and Models
import { ReportModel, ReportsService } from '../../../../../core/reports';
import { FormGroup, FormBuilder } from '@angular/forms';

// material for table
import { MatTableDataSource } from '@angular/material/table';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports

const moment = _moment;

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-reports-group',
	templateUrl: './reports-group.component.html',
	styleUrls: ['./reports-group.component.scss'],
})
export class ReportsGroupComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	reports: ReportModel[] = [];
	proceedingColumns: string[] = ['S/N', 'Task', 'Remark', 'Date'];
	dataSource = new MatTableDataSource<ReportModel>(this.reports);
	pageIndex = 0;
	limit = 30;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	reportDetails: any;
	analyticsReportForm: FormGroup;
	pageTitle = 'Reports Overview';
	users;
	startD;
	endD;
	today;
	user = 'All';
	showForm = false;
	reportDate = this.today;
	currentlyShowing: any = Date.now();
	noReports = false;
	genRep = false;
	generatedReports: any;
	constructor(
		private reportsService: ReportsService,
		private router: Router,
		private fb: FormBuilder) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.reportsService.getUsers().subscribe(
			myusers => {
				this.users = myusers['success'];
				console.log('All users', this.users);
			}
		);
		this.initForm();
		this.getReports(0, this.limit);
	}

	countReports() {
		this.reportsService.getReportGroupAnalyticsCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}

	toggleForm() {
		// this.currentlyShowing = 'Select date';
		return this.showForm = !this.showForm;
	}

	initForm() {
		this.analyticsReportForm = this.fb.group({
			queryUser: [''],
			start: [''],
			end: [''],
		});
	}

	generateReport() {
		this.loadingSubject.next(true);
		this.analyticsReportForm.reset(this.analyticsReportForm.value);
		if (this.analyticsReportForm.value.start) {
			let startDat = new Date(this.analyticsReportForm.value.start);
			let startTime = startDat.getTime();
			console.log('start time', startTime);
			this.startD = this.analyticsReportForm.value.start;
			this.analyticsReportForm.patchValue({
				start: startTime
			});
		}
		if (this.analyticsReportForm.value.end) {
			let endDat = new Date(this.analyticsReportForm.value.end);
			let endTime = endDat.getTime();
			this.endD = this.analyticsReportForm.value.end;
			this.analyticsReportForm.patchValue({
				end: endTime
			});
		}
		this.getReportsAnalytics(this.analyticsReportForm.value, 0, 999);
	}

	getReportsAnalytics(payload, skip, limit) {
		this.loadingSubject.next(true);
		this.reportsService.getReportAnalytics(payload, skip, limit).subscribe(
			responseData => {
				this.genRep = true;
				this.generatedReports = responseData['success'];
				this.noReports = false;
				if (!responseData['success'].length) {
					this.noReports = true;
				}
				this.loadingSubject.next(false);
				this.showForm = false;
			},
			error => {
				console.log('Error Occured');
				this.loadingSubject.next(false);
			}
		);
	}

	seeReports(dateObj, i) {
		localStorage.setItem('groupDate', JSON.stringify(dateObj));
		this.router.navigate([`/strada/reports/reports/${i}`]);
	}

	getReports(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.reportsService.getReportGroupAnalytics(skip, limit).subscribe(
			responseData => {
				this.reports = responseData['success'];
				console.log('this.reports', this.reports);
				this.dataSource = new MatTableDataSource<ReportModel>(this.reports);
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
		} else {
			this.disableNext = false;
		}
		if (this.pageIndex === 0) {
			this.disablePrev = true;
			console.log('last page');
		} else {
			this.disablePrev = false;
		}
	}

	getNext() {
		this.pageIndex = this.pageIndex + 1;
		let skip = this.pageIndex * this.limit;
		this.getReports(skip, this.limit);
		this.countReports();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.countReports();
		this.getReports(skip, this.limit);
		this.itemNav();
	}

	ngOnDestroy() { }
}
