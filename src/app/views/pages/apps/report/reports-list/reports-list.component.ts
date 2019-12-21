// Angular
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { ReportModel, ReportsService } from '../../../../../core/reports';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
// material for table
import { MatTableDataSource } from '@angular/material/table';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports

const moment = _moment;

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-reports-list',
	templateUrl: './reports-list.component.html',
	styleUrls: ['./reports-list.component.scss'],
})
export class ReportsListComponent implements OnInit, OnDestroy {
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
	passDate: any = Date.now();
	noReports = false;
	constructor(
		private reportsService: ReportsService,
		private _location: Location,
		private fb: FormBuilder) { }

	ngOnInit() {
		let setDate: any = JSON.parse(localStorage.getItem('groupDate'));
		console.log('setDate', setDate);
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.initForm();
		this.today = new Date(`${setDate.year}/${setDate.month}/${setDate.day}`);
		console.log('today passed', this.today);
		this.passDate = new Date(`${setDate.year}/${setDate.month}/${setDate.day}`);
		let skip = this.pageIndex * this.limit;
		// this.getReports(skip, this.limit);
		this.reportsService.getUsers().subscribe(
			myusers => {
				this.users = myusers['success'];
				console.log('All users', this.users);
			}
		);
		this.reportsService.getReportsCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.resultsLength <= this.limit) {
					console.log('not up to 10', this.resultsLength);
					this.disableNext = true;
				} else {
					console.log('up to 10', this.resultsLength);
					this.disableNext = false;
				}
			}
		);
		setTimeout(() => {
			this.initReport(0, this.limit);
		}, 10);
	}

	goBack() {
		this._location.back();
	}

	countReports() {
		this.reportsService.getReportsCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}

	initForm() {
		this.analyticsReportForm = this.fb.group({
			queryUser: [''],
			start: [''],
			end: [''],
		});
	}

	getReports(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.reportsService.getReports(skip, limit).subscribe(
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

	toggleForm() {
		this.currentlyShowing = 'Select date';
		return this.showForm = !this.showForm;
	}

	initReport(skip, limit) {
		this.loadingSubject.next(true);
		const date: any = new Date(this.passDate);
		console.log('date to be used', date);
		this.currentlyShowing = this.passDate;
		let startHours = new Date(date).setHours(0);
		let startMins = new Date(startHours).setMinutes(0);
		let startSecs = new Date(startMins).setSeconds(0);
		let startD = startSecs;
		let endHours = new Date(date).setHours(23);
		let endMins = new Date(endHours).setMinutes(59);
		let endSecs = new Date(endMins).setSeconds(59);
		let endD = endSecs;
		console.log(endD, startD, 'end start now');
		let payload = {
			start: moment(startD).valueOf(),
			end: moment(endD).valueOf(),
			queryUser: ''
		};
		this.getReportsAnalytics(payload, skip, limit);
		this.loadingSubject.next(false);
	}

	generateReport(skip, limit) {
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
		// if (this.analyticsReportForm.valid.user)
		this.getReportsAnalytics(this.analyticsReportForm.value, skip, limit);
	}

	genReport(event) {
		this.currentlyShowing = this.reportDate;
		this.showForm = false;
		console.log(event, 'event target');
		this.loadingSubject.next(true);
		const date =  this.reportDate;
		let startHours = new Date(date).setHours(0);
		let startMins = new Date(startHours).setMinutes(0);
		let startSecs = new Date(startMins).setSeconds(0);
		let startD = startSecs;
		let endHours = new Date(date).setHours(23);
		let endMins = new Date(endHours).setMinutes(59);
		let endSecs = new Date(endMins).setSeconds(59);
		let endD = endSecs;
		console.log(endD, startD, 'start end now');
		moment(date).format('x');
		const payload = {
			start: moment(startD).valueOf(),
			end: moment(endD).valueOf(),
			queryUser: ''
		};
		console.log('payload for generating by date', payload);
		this.getReportsAnalytics(payload, 0, 999);
	}

	getReportsAnalytics(payload, skip, limit) {
		this.loadingSubject.next(true);
		this.reportsService.getReportAnalytics(payload, skip, limit).subscribe(
			responseData => {
				this.reports = responseData['success'];
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
		this.generateReport(skip, this.limit);
		this.countReports();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.countReports();
		this.generateReport(skip, this.limit);
		this.itemNav();
	}

	ngOnDestroy() { }
}
