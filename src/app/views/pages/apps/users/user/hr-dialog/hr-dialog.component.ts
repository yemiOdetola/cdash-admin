// Angular
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../../core/auth';
import { currentUser,  User } from '../../../../../../core/auth';
import { LayoutUtilsService, MessageType } from '../../../../../../core/_base/crud';
import { AppState } from '../../../../../../core/reducers';
import { select, Store } from '@ngrx/store';
// Services and Models
import { UserModel, UserService } from '../../../../../../core/users';

@Component({
	selector: 'kt-hr-dialog',
	templateUrl: './hr-dialog.component.html'
})
export class HrDialogComponent implements OnInit {
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	user$: Observable<User>;
	userDetails = '';
	form: FormGroup;
	users: UserModel[];
	userId: any;
	headId: any;
	cUser: string;
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<HrDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(
		private dialogRef: MatDialogRef<HrDialogComponent>,
		private fb: FormBuilder,
		private authService: AuthService,
		private store: Store<AppState>,
		private layoutUtilsService: LayoutUtilsService,
		private usersService: UserService,
		@Inject(MAT_DIALOG_DATA) data) { }

	ngOnInit() {
		this.form = this.fb.group({
            old: ['', Validators.required],
            password: ['', Validators.required],
		});
		this.user$ = this.store.pipe(select(currentUser));
		this.user$.subscribe(
			userData => {
				this.getAllUsers(userData['_id']);
				this. userId = userData['_id'];
			}
		);
	}
	userChanged(role) {
		this.cUser = role._id;
	}
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
	getAllUsers(id) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.usersService.hodList(id).subscribe(
			responseData => {
				this.users = responseData['success'];
				this.loadingSubject.next(false);
				console.log('all users returned', this.users);
			},
			error => {
				console.log('error', error);
			}
		);
	}

	save() {

		if ( this.headId && this.cUser) {
			this.loadingSubject.next(true);
			this.usersService.assign(this.headId, this.cUser).subscribe(
				data => {
					if (!data.success) {
						const msg = `Unable to assign HOD to this user`;
						this.layoutUtilsService.showActionNotification(msg, MessageType.Create, 10000, true, true);
						this.dialogRef.close();
					} else {
						console.log('success reponse', data);
						this.loadingSubject.next(false);
						const message = `Your have assigned HOD this user Successfully`;
						this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
						this.dialogRef.close();
					}
					this.dialogRef.close();
				},
				error => {
					this.loadingSubject.next(false);
					console.log('Error response', error);
					const title = 'Please Retry';
					const message = 'Sorry, Temporary Error Occured';
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
					// this.dialogRef.close();
				});
		} else {
			const msg = `Please select an HOD`;
			this.layoutUtilsService.showActionNotification(msg, MessageType.Create, 10000, true, true);
		}
	}

	close() {
		this.dialogRef.close();
	}

	getTitle(): string {
		return 'Change Password';
	}
}
