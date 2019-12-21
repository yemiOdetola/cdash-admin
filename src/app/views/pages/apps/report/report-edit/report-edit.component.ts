// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { ReportModel, ReportsService } from '../../../../../core/reports';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-report-edit',
	templateUrl: './report-edit.component.html',
	styleUrls: ['./report-edit.component.scss']
})
export class ReportEditComponent implements OnInit, OnDestroy {
	report: ReportModel;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldCReport: ReportModel;
	reportForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	selectedFile: File = null;
	idParams: string;
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private reportsService: ReportsService
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.initReportForm();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getReportDetails().subscribe(reportData => this.initReportForm(reportData));
			this.loadingSubject.next(true);
		} else {
			this.report = this.reportForm.value;
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.reportForm.value);
		console.log('form control', this.reportForm.controls);
	}

	getReportDetails() {
	return this.reportsService.getReportById(this.idParams).pipe(
			map(reportDetails => {
				this.report = reportDetails['success'];
				this.loadingSubject.next(false);
				console.log('retrieving report with pipe', this.report);
				return this.report;
			})
		);
	}

	initReportForm(report: any = {}) {
		this.reportForm = this.fb.group({
			description: [report.description || '', Validators.required],
			name: [report.name || '', Validators.required],

		});
	}

	getComponentTitle() {
		let result = 'Please Wait';
		if (!this.report || !this.report._id) {
			result = 'Create New Report';
			return result;
		}
		result = `Edit Report Description`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.reportForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.reportForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.report && this.report._id) {
			console.log('Report has an Id');
			let editedReport = this.reportForm.value;
			console.log('Report to send', editedReport);
			this.updateReport(editedReport);
			return;
		}
		this.addReport(this.reportForm.value);
	}

	updateReport(report) {
		this.reportsService.updateReport(report, this.report._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Updated Successfully`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/reports']);
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
	 * Add Report
	 *
	 * @param _report: ReportModel
	 * @param withBack: boolean
	 */
	addReport(_report: ReportModel) {
		this.loadingSubject.next(true);
		const payload = this.reportForm.value;
		console.log(payload);
		this.reportsService.createReport(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `Report has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/reports']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	reset() {
		this.report = Object.assign({}, this.oldCReport);
		this.initReportForm();
		this.hasFormErrors = false;
		this.reportForm.markAsPristine();
		this.reportForm.markAsUntouched();
		this.reportForm.updateValueAndValidity();
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
