import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportModel, ReportsService } from '../../../../../core/reports';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	reportId: string;
	reportDetails: any;
	pageTitle = 'Please wait...';
	constructor(
		private route: ActivatedRoute,
		private reportsService: ReportsService,
		private _location: Location,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.reportId = this.route.snapshot.params['id'];
		this.reportsService.getReportById(this.reportId).subscribe(
			singleReport => {
				this.reportDetails = singleReport['success'];
				console.log('this report details oninit', this.reportDetails);
				this.loadingSubject.next(false);
				this.pageTitle = `Report Details`;
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
		console.log('id returned', this.route.snapshot.params['id']);
	}

	goBack() {
		this._location.back();
	}

	onDelete() {
		const _title: string = 'Delete report';
		const _description: string = 'Are you sure to permanently delete this report?';
		const _waitDesciption: string = 'Deleting report';
		const _deleteMessage = `report has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.reportsService.deleteReport(this.reportId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/strada/reports/reports']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}
}
