// Angular
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { currentUser, Logout, User } from '../../../../core/auth';
import { AppState } from '../../../../core/reducers';
import { UserService } from '../../../../core/users';

@Component({
	selector: 'kt-profile-page',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	user$: Observable<User>;
	userDetails: any;
	userId = '';
	awaitError = 'Please Wait...';
	constructor(
		private store: Store<AppState>,
		private usersService: UserService) {}

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.user$ = this.store.pipe(select(currentUser));
		this.user$.subscribe(
			userData => {
				this.userId = userData['_id'];
				this.getUserDetails(userData['_id']);
				this.loadingSubject.next(false);
			}
		);
	}

	getUserDetails(id) {
		this.loadingSubject.next(true);
			this.usersService.getUserById(id).subscribe(
			singleUser => {
				this.userDetails = singleUser['user'];
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
				this.awaitError = 'Some Error Occured, Please Retry';
			}
		);
	}
}
