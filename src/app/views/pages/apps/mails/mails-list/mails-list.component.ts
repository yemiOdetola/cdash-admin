// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

// Services and Models
import { MailModel, MailsService } from '../../../../../core/mails';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';

// material for table
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material';
import * as moment from 'moment';

@Component({
	selector: 'kt-mails-list',
	templateUrl: './mails-list.component.html',
	styleUrls: ['./mails-list.component.scss']
})
export class MailsListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	mails: MailModel[];
	proceedingColumns: string[] = ['Subject', 'Sender Email', 'Sender Name', 'isRead', 'Last Reply'];
	dataSource: any;
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	editedStatus;
	editedMail;
	interval: any;
	constructor(
		private mailsService: MailsService,
		public dialog: MatDialog,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService) { }


	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.mailsService.getMailsCount().subscribe(
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
		this.getMails(skip, this.limit);
		this.interval = setInterval(() => {
			this.fetch();
		}, 30000);
	}

	seeDetails(mail) {
		localStorage.setItem('mailTo', JSON.stringify(mail));
		this.router.navigate([`/strada/mails/mail/${mail.creator_id}`]);
	}

    fetch() {
		let skip = this.pageIndex * this.limit;
	  this.getMailsCount();
	  this.getMails(skip, this.limit);
	}


	getMailsCount() {
		this.mailsService.getMailsCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
				if (((this.pageIndex * 10) + 10) >= this.resultsLength) {
					this.disableNext = true;
				} else {
					this.disableNext = false;
				}
			}
		);
	}

	getMails(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.mailsService.getMails(skip, limit).subscribe(
			responseData => {
				this.mails = responseData['success'];
				// console.log('start data', responseData['success'][0].toString());
				this.dataSource = new MatTableDataSource<MailModel>(this.mails);
				this.loadingSubject.next(false);
				console.log('all mails returned', this.mails);
			},
			error => {
				console.log('error', error);
			}
		);
	}

	itemNav() {
		if (((this.pageIndex * 10) + 10) >= this.resultsLength) {
			this.disableNext = true;;
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
    toNow(n: any) {
		const t = moment();
		 let duration = moment.duration(moment(t).diff(n));
		 let minutes = duration.asMinutes();
		 return Math.round(minutes);
	}
	getNext() {
		this.pageIndex = this.pageIndex + 1;
		let skip = this.pageIndex * this.limit;
		this.getMails(skip, this.limit);
		this.getMailsCount();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getMails(skip, this.limit);
		this.getMailsCount();
		this.itemNav();
	}

	getMailDetails(id) {
		this.loadingSubject.next(true);
		this.mailsService.getMailById(id).subscribe(
			responseData => {
				this.editedMail = responseData;
			},
			error => {
				console.log('error occures', error);
			}
		);
	}

	updateMail(mail, id) {
		this.mailsService.updateMail(mail, id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				const skip = this.pageIndex * this.limit;
				this.getMails(skip, this.limit);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	changed(status, mailId) {
		this.loadingSubject.next(true);
		this.getMailDetails(mailId);
		this.updateMail({status}, mailId);
		this.loadingSubject.next(false);
	}

	ngOnDestroy() {
		clearInterval(this.interval);
	 }
}

