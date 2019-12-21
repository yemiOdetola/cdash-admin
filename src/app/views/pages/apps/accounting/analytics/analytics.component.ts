import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { VendorsService } from '../../../../../core/vendors';
import { SalesService } from '../../../../../core/sales';
import { ClaimsService } from '../../../../../core/claims';
import { HrService } from '../../../../../core/hr';

@Component({
	selector: 'kt-analytics',
	templateUrl: './analytics.component.html',
	styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	contactId: string;
	contactDetails: any;
	pageTitle = 'Please wait...';
	saleId: string;
	saleDetails: any;
	totalVendors = '...';
	totalSales = '...';
	totalExpense = '...';
	totalPurchase = '...';
	totalLoan = '...';
	expenses;
	sales;
	justLoaded = true;
	expense0 = 1;
	expense1 = 1;
	expense2 = 1;
	expense3 = 1;
	expense4 = 1;
	expense5 = 1;
	expense6 = 1;
	expense7 = 1;
	expense8 = 1;
	expense9 = 1;
	expense10 = 1;
	expense11 = 1;
	sale0 = 1;
	sale1 = 1;
	sale2 = 1;
	sale3 = 1;
	sale4 = 1;
	sale5 = 1;
	sale6 = 1;
	sale7 = 1;
	sale8 = 1;
	sale9 = 1;
	sale10 = 1;
	sale11 = 1;
	chart: any;
	chart2: any;
	salesBreakdown;
	peakSale;
	peakLoan;
	loansBreakdown = [];
	chartType = 'ColumnChart';
	expenseYear: number = 2019;
	incomeYear: number = 2019;
	incomeChartReady = false;
	expenseChartReady = false;
	incomeDataSet = [{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }];
	expenseDataSet = [{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }];
	incomeData = [
		['JAN', this.sale0],
		['FEB', this.sale1],
		['MAR', this.sale2],
		['APR', this.sale3],
		['MAY', this.sale4],
		['JUN', this.sale5],
		['JUL', this.sale6],
		['AUG', this.sale7],
		['SEP', 10],
		['OCT', this.sale9],
		['NOV', this.sale10],
		['DEC', this.sale11],
	];
	expenseData = [
		['JAN', this.expense0],
		['FEB', this.expense1],
		['MAR', this.expense2],
		['APR', this.expense3],
		['MAY', this.expense4],
		['JUN', this.expense5],
		['JUL', this.expense6],
		['AUG', this.expense7],
		['SEP', this.expense8],
		['OCT', this.expense9],
		['NOV', this.expense10],
		['DEC', this.expense11],
	];

	// expenseChartOptions = {
	// 	animation: {
	// 		startup: true,
	// 		duration: 500,
	// 		easing: 'out',
	// 	},
	// 	colors: ['#FDA0A0'],
	// 	axisTitlesPosition: 'none',
	// 	baselineColor: '#EEE',
	// 	titlePosition: 'none',
	// 	backgroundColor: { stroke: '#FFFF', strokeWidth: 0, fill: '#FFF' },
	// 	dataOpacity: 1,
	// 	fontName: 'Poppins',
	// 	titleTextStyle: {
	// 		color: '#731515',
	// 		fontName: 'Poppins',
	// 		fontSize: 23,
	// 		bold: false
	// 	},
	// 	tooltip: { textStyle: { color: 'grey' }, showColorCode: true },
	// 	width: 506,
	// 	height: 297,
	// 	chartArea: { width: '100%', height: '90%', backgroundColor: '#FFF' },
	// 	bar: { groupWidth: '10%' },
	// 	legend: { position: 'none' },
	// 	hAxis: {
	// 		textStyle: {
	// 			fontSize: 10,
	// 			color: '#97979D',
	// 			fontName: 'Poppins'
	// 		},
	// 		baselineColor: 'red'
	// 	},
	// 	vAxis: {
	// 		textPosition: 'none',
	// 		gridlines: {
	// 			count: 0,
	// 			color: 'transparent'
	// 		},
	// 	},
	// };

	// incomeChartOptions = {
	// 	animation: {
	// 		startup: true,
	// 		duration: 500,
	// 		easing: 'out',
	// 	},
	// 	colors: ['#B5FFC9'],
	// 	axisTitlesPosition: 'none',
	// 	baselineColor: '#EEE',
	// 	titlePosition: 'none',
	// 	backgroundColor: { stroke: '#FFFF', strokeWidth: 0, fill: '#FFF' },
	// 	dataOpacity: 1,
	// 	fontName: 'Poppins',
	// 	titleTextStyle: {
	// 		color: '#731515',
	// 		fontName: 'Poppins',
	// 		fontSize: 23,
	// 		bold: false
	// 	},
	// 	tooltip: { textStyle: { color: 'grey' }, showColorCode: true },
	// 	width: 506,
	// 	height: 297,
	// 	chartArea: { width: '100%', height: '90%', backgroundColor: '#FFF' },
	// 	bar: { groupWidth: '10%' },
	// 	legend: { position: 'none' },
	// 	hAxis: {
	// 		textStyle: {
	// 			fontSize: 10,
	// 			color: '#97979D',
	// 			fontName: 'Poppins'
	// 		},
	// 		baselineColor: 'red'
	// 	},
	// 	vAxis: {
	// 		textPosition: 'none',
	// 		gridlines: {
	// 			count: 0,
	// 			color: 'transparent'
	// 		},
	// 	},
	// };

	barChartOptions = {
		scaleShowVerticalLines: false,
		responsive: true,
		label: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'],
		legend: {
			display: false
		},
		layout: {
			padding: {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0
			}
		},
		scales: {
			xAxes: [{
				barPercentage: 0.1,
				gridLines: {
					color: 'rgba(0, 0, 0, 0)',
				},
				scaleLabel: {
					display: true,
					fontColor: '#97979D'
				},
				ticks: {
					beginAtZero: true,
					fontSize: 10,
					fontColor: '#97979D',
					fontName: 'Poppins'
				}
			}],
			yAxes: [{
				gridLines: {
					color: 'rgba(0, 0, 0, 0)',
				},
				ticks: {
					display: false,
					beginAtZero: true,
					fontColor: 'transparent'
				}
			}]
		}
	};
	barChart2Options = {
		scaleShowVerticalLines: false,
		responsive: true,
		data: {
			labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'],
			datasets: [{
				data: this.incomeDataSet,
			}]
		},
		legend: {
			display: false
		},
		layout: {
			padding: {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0
			}
		},
		scales: {
			xAxes: [{
				barPercentage: 0.1,
				gridLines: {
					color: 'rgba(0, 0, 0, 0)',
				},
				scaleLabel: {
					display: true,
					fontColor: '#97979D'
				},
				ticks: {
					beginAtZero: true,
					fontSize: 10,
					fontColor: '#97979D',
					fontName: 'Poppins'
				}
			}],
			yAxes: [{
				gridLines: {
					color: 'rgba(0, 0, 0, 0)',
				},
				ticks: {
					display: false,
					beginAtZero: true,
					fontColor: 'transparent'
				}
			}]
		}
	};
	barChartColors = [
		{
			backgroundColor: '#FDA0A0',
		},
		{ backgroundColor: '#FDA0A0', }
	];

	// barChart2Colors = [
	// 	{
	// 		backgroundColor: 'green',
	// 	},
	// ];
	barChartLabels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
	barChartType = 'bar';
	barChartLegend = true;
	constructor(
		private route: ActivatedRoute,
		private vendorsService: VendorsService,
		private salesService: SalesService,
		private hrService: HrService,
		private claimsService: ClaimsService,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.getSalesBreakdown();
		let year = new Date();
		this.getIncomeYearlyAnalytics(year.getFullYear());
		this.getExpenseYearlyAnalytics(year.getFullYear());
		this.getExpenseValue();
		this.getSalesValue();
		this.getLoansBreakdown();
	}

	getExpenseValue() {
		this.hrService.getTotalExpense().subscribe(
			expenses => {
				this.expenses = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				this.totalExpense = this.expenses;
				this.loadingSubject.next(false);
			}
		);
	}

	getSalesValue() {
		this.hrService.getTotalSales().subscribe(
			sales => {
				console.log('total sales value res', sales);
				this.totalSales = sales.success.sales;
				this.loadingSubject.next(false);
			}
		);
	}

	formatToThousand(number) {
		return String(number).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,');
	}

	passExpenseYear(event) {
		this.justLoaded = false;
		console.log('year clicked', event.target.value);
		console.log(this.expenseYear, 'expenseYear');
		this.getExpenseYearlyAnalytics(this.expenseYear);
	}

	passIncomeYear(event) {
		this.justLoaded = false;
		console.log('year clicked', event.target.value);
		console.log(this.incomeYear, 'incomeYear');
		this.getIncomeYearlyAnalytics(this.incomeYear);
	}

	getExpenseYearlyAnalytics(year) {
		this.loadingSubject.next(true);
		const message = 'Please wait';
		this.layoutUtilsService.showActionNotification(message, MessageType.Create, 1000, true, true);
		this.hrService.getYearQueriedExpenses(year).subscribe(
			expenses => {
				this.expenses = expenses['success'];
				console.log('expense for the year', this.expenses);
				if (this.justLoaded === !true) {
					this.totalExpense = this.expenses.purchase;
				}
				for (let i = 0; i < 12; i++) {
					this.getExpenseChartData(i, year);
					console.log('called for position in response', i);
				}
				this.loadingSubject.next(false);
			}
		);
	}

	getIncomeYearlyAnalytics(year) {
		this.loadingSubject.next(true);
		const message = 'Please wait';
		this.layoutUtilsService.showActionNotification(message, MessageType.Create, 1000, true, true);
		this.hrService.getYearQueriedIncome(year).subscribe(
			sales => {
				this.sales = sales['success'];
				console.log('sales for the year', this.sales);
				if (this.justLoaded === !true) {
					this.totalSales = this.sales.sales;
				}
				for (let i = 0; i < 12; i++) {
					this.getIncomeChartData(i, year);
				}
				this.loadingSubject.next(false);
			}
		);
	}

	getExpenseChartData(month, year) {
		const message = 'Please wait...';
		this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
		this.hrService.getQueriedExpenses(month, year).subscribe(
			expenses => {
				// switch (month) {
				// 	case 0:
				// 		this.expense0 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				// 		console.log(this.expense0, 'expense0 in chart');
				// 	case 1:
				// 		this.expense1 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				// 		console.log(this.expense1, 'expense1 in chart');
				// 	case 2:
				// 		this.expense2 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				// 		console.log(this.expense2, 'expense2 in chart');
				// 	case 3:
				// 		this.expense3 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				// 		console.log(this.expense3, 'expense3 in chart');
				// 	case 4:
				// 		this.expense4 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				// 		console.log(this.expense4, 'expense4 in chart');
				// 	case 5:
				// 		this.expense5 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				// 		console.log(this.expense5, 'expense5 in chart');
				// 	case 6:
				// 		this.expense6 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				// 		console.log(this.expense6, 'expense6 in chart');
				// 	case 7:
				// 		this.expense7 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				// 		console.log(this.expense7, 'expense7 in chart');
				// 	case 8:
				// 		this.expense8 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				// 		console.log(this.expense8, 'expense8 in chart');
				// 	case 9:
				// 		this.expense9 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				// 		console.log(this.expense9, 'expense9 in chart');
				// }
				if (month === 0) {
					this.expense0 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				}
				if (month === 1) {
					this.expense1 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				}
				if (month === 2) {
					this.expense2 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				}
				if (month === 3) {
					this.expense3 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				}
				if (month === 4) {
					this.expense4 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				}
				if (month === 5) {
					this.expense5 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				}
				if (month === 6) {
					this.expense6 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				}
				if (month === 7) {
					this.expense7 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				}
				if (month === 8) {
					this.expense8 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				}
				if (month === 9) {
					this.expense9 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				}
				if (month === 10) {
					this.expense10 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				}
				if (month === 11) {
					this.expense11 = expenses.success.claim + expenses.success.purchase + expenses.success.loan;
				}
				this.expenses = expenses['success'];
				// tslint:disable-next-line: max-line-length
				this.expenseDataSet = [{ data: [this.expense0, this.expense1, this.expense2, this.expense3, this.expense4, this.expense5, this.expense6, this.expense7, this.expense8, this.expense9, this.expense10, this.expense11] }];
				this.expenseChartReady = true;
				console.log('expense for the year', this.expenses);
				// this.totalExpense = this.expenses.purchase;
				this.loadingSubject.next(false);
			}
		);
	}

	getIncomeChartData(month, year) {
		const message = 'Please wait...';
		this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
		this.hrService.getQueriedSales(month, year).subscribe(
			sales => {
				// switch (month) {
				// 	case 0:
				// 		this.sale0 = sales.success.sales;
				// 		console.log(this.sale0, 'sale0 in chart');
				// 	case 1:
				// 		this.sale1 = sales.success.sales;
				// 		console.log(this.sale1, 'sale1 in chart');
				// 	case 2:
				// 		this.sale2 = sales.success.sales;
				// 		console.log(this.sale2, 'sale2 in chart');
				// 	case 3:
				// 		this.sale3 = sales.success.sales;
				// 		console.log(this.sale3, 'sale3 in chart');
				// 	case 4:
				// 		this.sale4 = sales.success.sales;
				// 		console.log(this.sale4, 'sale4 in chart');
				// 	case 5:
				// 		this.sale5 = sales.success.sales;
				// 		console.log(this.sale5, 'sale5 in chart');
				// 	case 6:
				// 		this.sale6 = sales.success.sales;
				// 		console.log(this.sale6, 'sale6 in chart');
				// 	case 7:
				// 		this.sale7 = sales.success.sales;
				// 		console.log(this.sale7, 'sale7 in chart');
				// 	case 8:
				// 		this.sale8 = sales.success.sales;
				// 		console.log(this.sale8, 'sale8 in chart');
				// 	case 9:
				// 		this.sale9 = sales.success.sales;
				// 		console.log(this.sale9, 'sale9 in chart');
				// 	case 10:
				// 		this.sale10 = sales.success.sales;
				// 		console.log(this.sale10, 'sale10 in chart');
				// 	case 11:
				// 		this.sale11 = sales.success.sales;
				// 		console.log(this.sale11, 'sale11 in chart');
				// }
				if (month === 0) {
					this.sale0 = sales.success.sales;
				}
				if (month === 1) {
					this.sale1 = sales.success.sales;
				}
				if (month === 2) {
					this.sale2 = sales.success.sales;
				}
				if (month === 3) {
					this.sale3 = sales.success.sales;
				}
				if (month === 4) {
					this.sale4 = sales.success.sales;
				}
				if (month === 5) {
					this.sale5 = sales.success.sales;
				}
				if (month === 6) {
					this.sale6 = sales.success.sales;
				}
				if (month === 7) {
					this.sale7 = sales.success.sales;
				}
				if (month === 8) {
					this.sale8 = sales.success.sales;
				}
				if (month === 9) {
					this.sale9 = sales.success.sales;
				}
				if (month === 10) {
					this.sale10 = sales.success.sales;
				}
				if (month === 11) {
					this.sale11 = sales.success.sales;
				}
				this.incomeDataSet = [{
					data:
						[this.sale0, this.sale1, this.sale2, this.sale3, this.sale4, this.sale5, this.sale6, this.sale7, this.sale8, this.sale9, this.sale10, this.sale11]
				}];
				this.incomeData = [
					['JAN', this.sale0],
					['FEB', this.sale1],
					['MAR', this.sale2],
					['APR', this.sale3],
					['MAY', this.sale4],
					['JUN', this.sale5],
					['JUL', this.sale6],
					['AUG', this.sale7],
					['SEP', this.sale8],
					['OCT', this.sale9],
					['NOV', this.sale10],
					['DEC', this.sale11],
				];
				this.incomeChartReady = true;
				console.log('expense for the year', this.expenses);
				// this.totalExpense = this.expenses.purchase;
				this.loadingSubject.next(false);
			}
		);
	}

	runcurrentMonth() {
		this.hrService.getQueriedSales(10, 2019).subscribe(
			sales => {
				this.sales = sales['success'];
				console.log('sales for the this month/year', this.sales);
				this.totalSales = this.sales.sales;
				this.loadingSubject.next(false);
			}
		);
	}

	runcurrentMothExpense() {
		this.hrService.getQueriedExpenses(10, 2019).subscribe(
			sales => {
				console.log('expense for the this month/year', this.sales);
				this.totalSales = this.sales.sales;
				this.loadingSubject.next(false);
			}
		);
	}

	getSalesBreakdown() {
		this.salesService.getSales(0, 5).subscribe(
			breakdown => {
				this.salesBreakdown = breakdown['success'];
				console.log('salesbreakdown', this.salesBreakdown);
				this.loadingSubject.next(false);
				this.salesBreakdown.sort((a, b) => b.invoice_amount - a.invoice_amount);
				this.peakSale = this.salesBreakdown[0];
			}
		);
	}

	getLoansBreakdown() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimsService.getClaims(0, 5, 'loan', '').subscribe(
			responseData => {
				this.loansBreakdown = responseData['success'];
				this.loadingSubject.next(false);
				this.loansBreakdown.sort((a, b) => b.amount - a.amount);
				this.peakLoan = this.loansBreakdown[0];
			},
			error => {
				console.log('error', error);
			});
	}

	// initBarchart() {
	// 	return this.chart = new CanvasJS.Chart('chartContainer', {
	// 		animationEnabled: true,
	// 		theme: 'light1',
	// 		exportEnabled: false,
	// 		dataPointWidth: 5,
	// 		title: {
	// 			text: ''
	// 		},
	// 		axisY: {
	// 			gridThickness: 0,
	// 			tickLength: 0,
	// 			lineThickness: 0,
	// 			labelFormatter: function() {
	// 				return ' ';
	// 			}
	// 		},
	// 		axisX: {
	// 			gridThickness: 0,
	// 			labelFontColor: 'grey',
	// 			labelFontSize: '7',
	// 		},
	// 		data: [{
	// 			type: 'column',
	// 			color: 'pink',
	// 			barThickness: 1.0,
	// 			dataPoints: [
	// 				{ y: 200, label: 'Jan' },
	// 				{ y: 540, label: 'Feb' },
	// 				{ y: 300, label: 'Mar' },
	// 				{ y: 500, label: 'Apr' },
	// 				{ y: 800, label: 'May' },
	// 				{ y: 100, label: 'Jun' },
	// 				{ y: 900, label: 'Jul' },
	// 				{ y: 900, label: 'Aug' },
	// 				{ y: 30, label: 'Sep' },
	// 				{ y: 370, label: 'Oct' },
	// 				{ y: 600, label: 'Nov' },
	// 				{ y: 400, label: 'Dec' }
	// 			]
	// 		}],
	// 	});
	// }

	// initBarchart2() {
	// 	return this.chart2 = new CanvasJS.Chart('chartContainer2', {
	// 		animationEnabled: true,
	// 		theme: 'light1',
	// 		exportEnabled: false,
	// 		title: {
	// 			text: ''
	// 		},
	// 		axisY: {
	// 			gridThickness: 0,
	// 			labelFontColor: 'grey',
	// 			labelFontSize: '10',
	// 		},
	// 		axisX: {
	// 			gridThickness: 0,
	// 			labelFontColor: 'grey',
	// 			labelFontSize: '10',
	// 		},
	// 		data: [{
	// 			type: 'column',
	// 			color: 'lightGreen',
	// 			dataPoints: [
	// 				{ y: 200, label: 'Jan' },
	// 				{ y: 540, label: 'Feb' },
	// 				{ y: 300, label: 'Mar' },
	// 				{ y: 500, label: 'Apr' },
	// 				{ y: 800, label: 'May' },
	// 				{ y: 100, label: 'Jun' },
	// 				{ y: 900, label: 'Jul' },
	// 				{ y: 900, label: 'Aug' },
	// 				{ y: 30, label: 'Sep' },
	// 				{ y: 370, label: 'Oct' },
	// 				{ y: 600, label: 'Nov' },
	// 				{ y: 400, label: 'Dec' }
	// 			]
	// 		}]
	// 	});
	// }
}
