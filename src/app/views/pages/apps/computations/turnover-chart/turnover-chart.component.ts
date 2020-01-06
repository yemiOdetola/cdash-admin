// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
// Services and Models
import { AssetsService } from '../../../../../core/assets';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports

const moment = _moment;

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-turnover-chart',
	templateUrl: './turnover-chart.component.html',
	styleUrls: ['./turnover-chart.component.scss'],
})
export class TurnoverChartComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	reportDetails: any;
	recurringForm: FormGroup;
	pageTitle = 'Capital expenditure';
	allAssets = [];
	year;
	years = [];
	analyticsData;
	barChartData = [
		{data: [0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'expenses'},
		{data: [0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'turnover'}
	  ];
	barChartLabels = ['2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012'];
	barChartType = 'bar';
	chartOptions;
	selectedCurrency = '₦';
	naira =  '₦';
	ty$sign = '$';
	analyticss;

	constructor(
		private assetsService: AssetsService,
		private router: Router,
		private _location: Location,
		private fb: FormBuilder) { }

	ngOnInit() {
		this.initAnalytics();
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.chartOptions = {
			scales: {
				xAxes: [{
					barThickness: 20,
					maxBarThickness: 26,
					gridLines: {
						display: true,
						color: '#ffffff'
					}
				}],
				yAxes: [{
					gridLines: {
						display: true,
						ticks: true
					}
				}],
			},
		};
	}

	goBack() {
		this._location.back();
	}

	initAnalytics() {
		this.loadingSubject.next(true);
		const payload = null;
		console.log('payload sent', payload);
		this.assetsService.getAllAssetsTurnover(payload).subscribe(
			response => {
				this.barChartData = [
					{data: [
						response.expenses[0].amount,
						response.expenses[1].amount,
						response.expenses[2].amount,
						response.expenses[3].amount,
						response.expenses[4].amount,
						response.expenses[5].amount,
						response.expenses[6].amount,
						response.expenses[7].amount,
						response.expenses[8].amount,
					], label: 'expenses'},
					{data: [
						response.turnovers[0].amount,
						response.turnovers[1].amount,
						response.turnovers[2].amount,
						response.turnovers[3].amount,
						response.turnovers[4].amount,
						response.turnovers[5].amount,
						response.turnovers[6].amount,
						response.turnovers[7].amount,
						response.turnovers[8].amount,
					], label: 'turnovers'}
				  ];
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			}
		);
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

	ngOnDestroy() { }
}
