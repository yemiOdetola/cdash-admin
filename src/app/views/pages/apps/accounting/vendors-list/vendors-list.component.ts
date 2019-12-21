// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { VendorModel, VendorsService } from '../../../../../core/vendors';
import { ClaimModel, ClaimsService } from '../../../../../core/claims';

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
	resultsLength1: number = 0;
	pageIndex1 = 0;
	limit1 = 10;
	disablePrev1 = true;
	disableNext1 = false;
	resultsLength2: number = 0;
	pageIndex2 = 0;
	limit2 = 10;
	disablePrev2 = true;
	disableNext2 = false;
	claims: ClaimModel[];
	loans: ClaimModel[];
	activeList = 'vendors';
	constructor(private vendorsService: VendorsService, private claimsService: ClaimsService) { }

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
		this.claimsService.getClaimsCount(1, 'claim', '').subscribe(
			countResult => {
				this.resultsLength1 = countResult['count'];
				if (this.resultsLength1 <= 10) {
					console.log('not up to 10', this.resultsLength1);
					this.disableNext1 = true;
				} else {
					console.log('up to 10', this.resultsLength1);
					this.disableNext1 = false;
				}
			}
		);
		let skip1 = this.pageIndex1 * this.limit;
		this.getClaims(skip1, this.limit);

		this.claimsService.getClaimsCount(1, 'loan','').subscribe(
			countResult => {
				this.resultsLength2 = countResult['count'];
				if ( this.resultsLength2 <= 10) {
					console.log('not up to 10', this.resultsLength2);
					this.disableNext2 = true;
				} else {
					console.log('up to 10', this.resultsLength2);
					this.disableNext2 = false;
				}
			}
		);
		let skip2 = this.pageIndex2 * this.limit;
		this.getLoans(skip2, this.limit);
	}

	switchList(list) {
		return this.activeList = list;
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
		this.loadingSubject.next(false);
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getAllVendors(skip, this.limit);
		this.countAllVendors();
		this.itemNav();
	}

/////////// CLAIMS ///////

	countClaims() {
		this.claimsService.getClaimsCount(1, 'claim','').subscribe(
			countResult => {
				this.resultsLength1 = countResult['count'];
				if (this.pageIndex1 > 0) {
					this.disablePrev1 = false;
				}
			}
		);
	}

	getClaims(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimsService.getClaims(skip, limit, 'claim', '').subscribe(
			responseData => {
				this.claims = responseData['success'];
				this.loadingSubject.next(false);
				console.log('all claims returned', this.claims);
			},
			error => {
				console.log('error', error);
			});
	}

	itemNav1() {
		if (((this.pageIndex1 * 10) + 10) >= this.resultsLength1) {
			this.disableNext1 = true;
			console.log('paste total numbers');
			// return;
		} else {
			this.disableNext1 = false;
		}
		if (this.pageIndex1 === 0) {
			this.disablePrev1 = true;
			console.log('last page');
			// return;
		} else {
			this.disablePrev1 = false;
		}
	}
	getNext1() {
		this.pageIndex1 = this.pageIndex1 + 1;
		let skip = this.pageIndex1 * this.limit;
		this.getClaims(skip, this.limit);
		this.countClaims();
		this.itemNav1();
	}

	getPrev1() {
		this.pageIndex1 = this.pageIndex1 - 1;
		let skip = this.pageIndex1 * this.limit;
		this.getClaims(skip, this.limit);
		this.countClaims();
		this.itemNav1();
	}


	///////////// LOANS /////

	countClaims2() {
		this.claimsService.getClaimsCount(1, 'loan','').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}

	getLoans(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimsService.getClaims(skip, limit, 'loan','').subscribe(
			responseData => {
				this.loans = responseData['success'];
				this.loadingSubject.next(false);
				console.log('all loans returned', this.loans);
			},
			error => {
				console.log('error', error);
			});
	}

	itemNav2() {
		if (((this.pageIndex2 * 10) + 10) >= this.resultsLength2) {
			this.disableNext2 = true;
			console.log('paste total numbers');
			// return;
		} else {
			this.disableNext2 = false;
		}
		if (this.pageIndex2 === 0) {
			this.disablePrev2 = true;
			console.log('last page');
			// return;
		} else {
			this.disablePrev2 = false;
		}
	}
	getNext2() {
		this.pageIndex2 = this.pageIndex2 + 1;
		let skip = this.pageIndex2 * this.limit;
		this.getLoans(skip, this.limit);
		this.countClaims2();
		this.itemNav2();
	}

	getPrev2() {
		this.pageIndex2 = this.pageIndex2 - 1;
		let skip = this.pageIndex2 * this.limit;
		this.getLoans(skip, this.limit);
		this.countClaims2();
		this.itemNav2();
	}

	ngOnDestroy() { }
}
