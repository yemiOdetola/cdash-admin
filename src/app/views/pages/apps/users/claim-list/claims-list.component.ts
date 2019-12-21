// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { ClaimModel, ClaimsService } from '../../../../../core/claims';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';

// material for table
// import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
// import { MatSort } from '@angular/material/sort';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-claims-list',
	templateUrl: './claims-list.component.html',
	styleUrls: ['./claims-list.component.scss']
})
export class ClaimsListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	claims: ClaimModel[];
	proceedingColumns: string[] = ['Name', 'Email', 'Phone',];
	dataSource: any;
	resultsLength: number = 0;
	pageIndex = 0;
	limit = 10;
	disablePrev = true;
	disableNext = false;
	constructor(private claimsService: ClaimsService,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimsService.getClaimsTypeCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.resultsLength <= 10) {
					console.log('not up to 10', this.resultsLength);
					this.disableNext = true;
				} else {
					console.log('up to 10', this.resultsLength);
					this.disableNext = false;
				}
			}
		);
		let skip = this.pageIndex * this.limit;
		this.getAllClaims(skip, this.limit);
	}
	countClaims() {
		this.claimsService.getClaimsTypeCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}
	getAllClaims(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.claimsService.getAllClaimTypes(skip, limit).subscribe(
			responseData => {
				this.claims = responseData['success'];
				console.log(this.claims);
				this.dataSource = new MatTableDataSource<ClaimModel>(this.claims);
				this.loadingSubject.next(false);
				console.log('all claims returned', this.claims);
			},
			error => {
				console.log('error', error);
			}
		);
	}
	onDelete(id) {
		const _title: string = 'Delete Claim';
		const _description: string = 'Are you sure to permanently delete this Claim?';
		const _waitDesciption: string = 'Deleting Claim';
		const _deleteMessage = `Claim has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.claimsService.deleteTypeRequest(id).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					// this.router.navigate(['/strada/users/claims']);
					let skip = this.pageIndex * this.limit;
					this.getAllClaims(skip, this.limit);
					this.countClaims();
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
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
		this.loadingSubject.next(true);
		this.pageIndex = this.pageIndex + 1;
		let skip = this.pageIndex * this.limit;
		this.getAllClaims(skip, this.limit);
		this.loadingSubject.next(false);
		this.itemNav();
		this.countClaims();
	}

	getPrev() {
		this.loadingSubject.next(true);
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getAllClaims(skip, this.limit);
		this.loadingSubject.next(false);
		this.itemNav();
		this.countClaims();
	}

	ngOnDestroy() { }
}
