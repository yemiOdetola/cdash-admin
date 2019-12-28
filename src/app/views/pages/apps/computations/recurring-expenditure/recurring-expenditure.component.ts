// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
// Services and Models
import { ReportsService } from '../../../../../core/reports';
import { AssetsService } from '../../../../../core/assets';
import { FormGroup, FormBuilder } from '@angular/forms';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports

const moment = _moment;

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-recurring-expenditure',
	templateUrl: './recurring-expenditure.component.html',
	styleUrls: ['./recurring-expenditure.component.scss'],
})
export class RecurringExpenditureComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	reportDetails: any;
	recurringForm: FormGroup;
	pageTitle = 'Recurring expenditure';
	allAssets = [];
	year;
	years = [];
	analyticsData;
	pieChartLabels = ['All assets', 'Selected asset'];
	pieChartData = [0, 0];
	chartType = 'pie';
	chartOptions;
	selectedCurrency = '₦';
	analyticss: {
		total_amount: 0,
		amount: 0
	};
	constructor(
		private assetsService: AssetsService,
		private reportsService: ReportsService,
		private router: Router,
		private fb: FormBuilder) { }

	ngOnInit() {
		this.initAnalytics();
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.getAllAssets();
		const fullDate = new Date();
		this.year = fullDate.getFullYear();
		for (let i = 0; i < 10; i++) {
			this.years.push(this.year--);
		}
		this.initForm();
		this.chartOptions  = {
			scaleShowVerticalLines: false,
			responsive: true,
			legend: {
				display: true
			},
			layout: {
				padding: {
					left: 0,
					right: 0,
					top: 0,
					bottom: 0
				}
			},
		};
	}

	getAllAssets() {
		this.loadingSubject.next(true);
		this.assetsService.getAllAssets().subscribe(
			assetsAll => {
				this.allAssets = assetsAll['data'];
				this.loadingSubject.next(false);
			}
		);
	}

	initForm() {
		this.recurringForm = this.fb.group({
			id: [''],
			currency: [''],
			year: [''],
		});
	}


	seeReports(dateObj, i) {
		localStorage.setItem('groupDate', JSON.stringify(dateObj));
		this.router.navigate([`/strada/reports/reports/${i}`]);
	}

	generateAnalytics() {
		this.loadingSubject.next(true);
		this.assetsService.getAssetsReccurentExp(this.recurringForm.value).subscribe(
			response => {
				this.analyticss = response;
				if (response['currency'] === 'dollar') {
					this.selectedCurrency = '$';
				} else {
					this.selectedCurrency = '₦';
				}
				this.pieChartLabels = [
					'Total Assets',
					'Selected asset'
				];
				let total = response['total_amount'];
				if (response['amount'] >= response['total_amount']) {
					total = 0;
				}
				this.pieChartData = [total, response['amount']];
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			}
		);
	}


	initAnalytics() {
		this.loadingSubject.next(true);
		const payload =  null;
		console.log('payload sent', payload);
		this.assetsService.getAssetsReccurentExp(payload).subscribe(
			response => {
				this.analyticss = response;
				if (response['currency'] === 'dollar') {
					this.selectedCurrency = '$';
				} else {
					this.selectedCurrency = '₦';
				}
				this.analyticsData = response['total_amount'];
				this.pieChartLabels = [
					'Total Assets',
					'Selected asset'
				];
				this.pieChartData = [response['total_amount'], response['amount']];
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			}
		);
	}

	ngOnDestroy() { }
}
