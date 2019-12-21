// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { ContactModel, ContactsService } from '../../../../../core/contacts';

// material for table
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-contacts-list',
	templateUrl: './contacts-list.component.html',
	styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	contacts: ContactModel[];
	proceedingColumns: string[] = ['Name', 'Company', 'Email', 'Phone', 'Source'];
	dataSource: any;
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	constructor(private contactsService: ContactsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.contactsService.getContactsCount('').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				this.loadingSubject.next(false);
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
		this.getContacts(skip, this.limit);
	}

	getContacts(skip, limit) {
		this.loadingSubject.next(true);
		this.contactsService.getContacts(skip, limit,'').subscribe(
			responseData => {
				this.contacts = responseData['success'];
				this.dataSource = new MatTableDataSource<ContactModel>(this.contacts);
				this.loadingSubject.next(false);
				console.log('all contacts returned', this.contacts);
			},
			error => {
				console.log('error', error);
			});
	}
	countContacts() {
		this.loadingSubject.next(true);
		this.contactsService.getContactsCount('').subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
				this.loadingSubject.next(false);
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
		this.getContacts(skip, this.limit);
		this.countContacts();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getContacts(skip, this.limit);
		this.countContacts();
		this.itemNav();
	}

	ngOnDestroy() { }
}
