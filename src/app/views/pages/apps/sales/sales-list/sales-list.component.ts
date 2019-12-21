// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { SaleModel, SalesService } from '../../../../../core/sales';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';

// material for table
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ChangeStatusDialogComponent } from './change-status-dialog/change-status-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';

@Component({
	selector: 'kt-sales-list',
	templateUrl: './sales-list.component.html',
	styleUrls: ['./sales-list.component.scss']
})
export class SalesListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	sales: SaleModel[];
	proceedingColumns: string[] = ['Name', 'Quotation Amount', 'Unit', 'Status'];
	dataSource: any;
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	editedStatus;
	editedSale;
	statuses = ['Sales Initiated',
		'Email Sent',
		'Scheduled Meeting',
		'Sent MOU/Proposal',
		'Review MOU/Proposal',
		'Follow Up Requested',
		'Sent Invoice',
		'Signed Agreement',
		'Completed'
	];
	constructor(
		private salesService: SalesService,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.salesService.getSalesCount().subscribe(
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
		this.getSales(skip, this.limit);
	}

	getSalesCount() {
		this.salesService.getSalesCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}

	getSales(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.salesService.getSales(skip, limit).subscribe(
			responseData => {
				this.sales = responseData['success'];
				// console.log('start data', responseData['success'][0].toString());
				this.dataSource = new MatTableDataSource<SaleModel>(this.sales);
				this.loadingSubject.next(false);
				console.log('all sales returned', this.sales);
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
		this.getSales(skip, this.limit);
		this.getSalesCount();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getSales(skip, this.limit);
		this.getSalesCount();
		this.itemNav();
	}

	getSaleDetails(id) {
		this.loadingSubject.next(true);
		this.salesService.getSaleById(id).subscribe(
			responseData => {
				this.editedSale = responseData;
			},
			error => {
				console.log('error occures', error);
			}
		);
	}

	updateSale(sale, id) {
		this.salesService.updateSale(sale, id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				const skip = this.pageIndex * this.limit;
				this.getSales(skip, this.limit);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	changed(status, saleId) {
		this.loadingSubject.next(true);
		this.getSaleDetails(saleId);
		this.updateSale({status}, saleId);
		this.loadingSubject.next(false);
	}

	ngOnDestroy() { }
}

