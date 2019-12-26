// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { UserService } from '../../../../../core/users';

// material for tabl

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-staffs-list',
	templateUrl: './staffs-list.component.html',
	styleUrls: ['./staffs-list.component.scss']
})
export class StaffsListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	staffs: any[];
	dataSource: any;
	resultsLength: number = 0;
	pageIndex = 0;
	limit = 10;
	disablePrev = true;
	disableNext = false;
	constructor(private usersService: UserService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.usersService.countStaffs().subscribe(
			countResult => {
				this.resultsLength = countResult['data'];
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
		this.getAllStaffs(skip, this.limit);
	}
	countAllStaffs() {
		this.usersService.countStaffs().subscribe(
			countResult => {
				this.resultsLength = countResult['data'];
				if ( this.resultsLength <= 10) {
					console.log('not up to 10', this.resultsLength);
					this.disableNext = true;
				} else {
					console.log('up to 10', this.resultsLength);
					this.disableNext = false;
				}
			}
		);
	}
	getAllStaffs(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.usersService.getStaffs(skip, limit).subscribe(
			response => {
				this.staffs = response['data'];
				this.loadingSubject.next(false);
				console.log('all staffs returned', this.staffs);
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

		} else {
			this.disableNext = false;
		}
		if (this.pageIndex === 0) {
			this.disablePrev = true;
			console.log('last page');
		} else {
			this.disablePrev = false;
		}
	}
	getNext() {
		this.pageIndex = this.pageIndex + 1;
		let skip = this.pageIndex * this.limit;
		this.getAllStaffs(skip, this.limit);
		this.countAllStaffs();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getAllStaffs(skip, this.limit);
		this.countAllStaffs();
		this.itemNav();
	}

	ngOnDestroy() { }
}
