import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportModel, ReportsService } from '../../../../../core/reports';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'kt-report-analytics',
	templateUrl: './report-analytics.component.html',
	styleUrls: ['./report-analytics.component.scss']
})
export class ReportAnalyticsComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	reportId: string;
	reportDetails: any;
	analyticsReportForm: FormGroup;
	pageTitle = 'Reports Overview';
	reportsAll = [];
	originalReports = [];
	reports: any;
	users = [];
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;

	// if limit is 10, skip = 0 on 1, page 2 skip = 10,limit remains, page 3 skip = 20, limit remains...
	constructor(
		private route: ActivatedRoute,
		private reportsService: ReportsService,
		private layoutUtilsService: LayoutUtilsService,
		private fb: FormBuilder,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.initForm();
		this.loadingSubject.next(false);
		this.reportsService.getUsers().subscribe(
			myusers => {
				this.users = myusers['success'];
				console.log('All users', this.users);
			}
		);
		this.reportsService.getReportsCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if ( this.resultsLength <= 10) {
					this.disableNext = true;
				} else {
					this.disableNext = false;
				}
			}
		);
		// let skip = this.pageIndex * this.limit;
	}
	initForm() {
		this.analyticsReportForm = this.fb.group({
			queryUser: [''],
			start: [''],
			end: [''],
		});
	}

	getReports(skip, limit) {
		this.loadingSubject.next(true);
		this.reportsService.getReportAnalytics(this.analyticsReportForm.value, skip, limit).subscribe(
			responseData => {
				this.reportsAll = responseData['success'];
				this.loadingSubject.next(false);
			},
			error => {
				console.log('Error Occured');
				this.loadingSubject.next(false);
			}
		);
	}
	generateReport(skip, limit) {
		this.loadingSubject.next(true);
		if (this.analyticsReportForm.value.start) {
			let startTime = this.analyticsReportForm.value.start.getTime();
			this.analyticsReportForm.patchValue({
				start: startTime
			});
		}
		if (this.analyticsReportForm.value.end) {
			let endTime = this.analyticsReportForm.value.end.getTime();
			this.analyticsReportForm.patchValue({
				end: endTime
			});
		}
		this.getReports(skip, limit);
	}

	itemNav() {
		if (((this.pageIndex * 10) + 10) >= this.resultsLength) {
			this.disableNext = true;
			console.log('paste total numbers');
			return;
		} else {
			this.disableNext = false;
		}
		if (this.pageIndex === 0) {
			this.disablePrev = true;
			console.log('last page');
			return;
		} else {
			this.disablePrev = false;
		}
	}
	getNext() {
		this.pageIndex = this.pageIndex + 1;
		let skip = this.pageIndex * this.limit;
		this.generateReport(skip, this.limit);
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.generateReport(skip, this.limit);
		this.itemNav();
	}

}
