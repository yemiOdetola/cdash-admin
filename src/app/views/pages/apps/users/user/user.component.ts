import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../../core/users';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';


@Component({
	selector: 'kt-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	userId: string;
	userDetails: any;
	pageTitle = 'Please wait...';
	nairaSign = '₦';
	constructor(
		private route: ActivatedRoute,
		private usersService: UserService,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router,
		private _location: Location,
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.userId = this.route.snapshot.params['id'];
		this.usersService.getUserById(this.userId).subscribe(
			singleUser => {
				this.userDetails = singleUser['data'];
				this.pageTitle = `${this.userDetails.name}`;
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
	}

	goBack() {
		this._location.back();
	}
}
