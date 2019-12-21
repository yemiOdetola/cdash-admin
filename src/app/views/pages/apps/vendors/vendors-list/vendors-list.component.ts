// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { VendorModel, VendorsService } from '../../../../../core/vendors';

// material for table
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-vendors-list',
	templateUrl: './vendors-list.component.html',
	styleUrls: ['./vendors-list.component.scss']
})
export class VendorsListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	vendors: VendorModel[];
	proceedingColumns: string[] = ['Name', 'Industry', 'Email', 'Phone', 'Website'];
	dataSource: any;
	resultsLength: number = 0;
	pageIndex = 0;
	limit = 10;
	disablePrev = true;
	disableNext = false;
	constructor(private vendorsService: VendorsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.vendorsService.getVendorsCount().subscribe(
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
		this.getAllVendors(skip, this.limit);
	}

	countAllVendors() {
		this.vendorsService.getVendorsCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}

	getAllVendors(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.vendorsService.getVendors(skip, limit).subscribe(
			responseData => {
				this.vendors = responseData['success'];
				this.dataSource = new MatTableDataSource<VendorModel>(this.vendors);
				this.loadingSubject.next(false);
				console.log('all vendors returned', this.vendors);
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
		this.getAllVendors(skip, this.limit);
		this.countAllVendors();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getAllVendors(skip, this.limit);
		this.countAllVendors();
		this.itemNav();
	}

	ngOnDestroy() { }
}
