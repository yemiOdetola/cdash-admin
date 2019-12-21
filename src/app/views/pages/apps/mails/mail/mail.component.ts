import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { UserService } from '../../../../../core/users';

@Component({
	selector: 'kt-mail',
	templateUrl: './mail.component.html',
	styleUrls: ['./mail.component.scss']
})
export class MailComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	creatorId: string;
	pageTitle = 'Please wait...';
	savedData;
	userDetails;
	constructor(
		private route: ActivatedRoute,
		private usersService: UserService,
		private _location: Location,) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.savedData = JSON.parse(localStorage.getItem('mailTo'));
		this.creatorId = this.route.snapshot.params['id'];
		console.log('id returned', this.route.snapshot.params['id']);
		this.getUserDetails(this.creatorId);
		this.loadingSubject.next(false);
	}

	goBack() {
		this._location.back();
	}

	toNow(n: any) {
		const t = moment();
		 let duration = moment.duration(moment(t).diff(n));
		 let minutes = duration.asMinutes();
		 return Math.round(minutes);
	}

	getUserDetails(id) {
		this.loadingSubject.next(true);
			this.usersService.getUserById(id).subscribe(
			singleUser => {
				this.userDetails = singleUser['user'];
				this.pageTitle = 'Email details';
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
		this.loadingSubject.next(false);
	}
}
