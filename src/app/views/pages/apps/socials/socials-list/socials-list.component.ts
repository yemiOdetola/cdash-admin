// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { SocialModel, SocialsService } from '../../../../../core/socials';

// material for table
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-socials-list',
	templateUrl: './socials-list.component.html',
	styleUrls: ['./socials-list.component.scss']
})
export class SocialsListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	links: any[];
	proceedingColumns: string[] = ['Title', 'Link'];
	dataSource: any;
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	constructor(private socialsService: SocialsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.socialsService.getLinksCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.resultsLength <= 10) {
					this.disableNext = true;
				} else {
					this.disableNext = false;
				}
			}
		);
		let skip = this.pageIndex * this.limit;
		this.getAllSocials(skip, this.limit);
	}

	countAllSocials() {
		this.socialsService.getLinksCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}

	getAllSocials(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.socialsService.getLinks(skip, limit).subscribe(
			responseData => {
				this.links = responseData['success'];
				this.dataSource = new MatTableDataSource<SocialModel>(this.links);
				this.loadingSubject.next(false);
				console.log('all links returned', this.links);
			},
			error => {
				console.log('error', error);
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
		this.pageIndex = this.pageIndex + 1;
		let skip = this.pageIndex * this.limit;
		this.getAllSocials(skip, this.limit);
		this.countAllSocials();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getAllSocials(skip, this.limit);
		this.countAllSocials();
		this.itemNav();
	}

	ngOnDestroy() { }
}
