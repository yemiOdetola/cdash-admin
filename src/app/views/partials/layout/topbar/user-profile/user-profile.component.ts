// Angular
import { Component, OnInit, Input } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout, User } from '../../../../../core/auth';

import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';

@Component({
	selector: 'kt-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
	// Public properties
	user$: Observable<User>;

	@Input() showAvatar: boolean = false;
	@Input() showHi: boolean = false;
	@Input() showBadge: boolean = true;
	showName = true;
	passwordDetails = {};

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	constructor(
		private store: Store<AppState>,
		public dialog: MatDialog
		) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.user$ = this.store.pipe(select(currentUser));
	}

	/**
	 * Log out
	 */
	logout() {
		this.store.dispatch(new Logout());
	}


	changePassword() {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = false;
		// dialogConfig.autoFocus = true;
		dialogConfig.width = '500px';
		const dialogRef = this.dialog.open(ChangePasswordDialogComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(
			passwordFormData => {
				this.passwordDetails = passwordFormData;
				console.log('Dialog output:', passwordFormData);
			}
		);
	}
}
