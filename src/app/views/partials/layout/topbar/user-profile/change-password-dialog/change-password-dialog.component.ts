// Angular
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../../core/auth';
import { LayoutUtilsService, MessageType } from '../../../../../../core/_base/crud';

@Component({
	selector: 'kt-change-password-dialog',
	templateUrl: './change-password-dialog.component.html'
})
export class ChangePasswordDialogComponent implements OnInit {
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	form: FormGroup;
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<ChangePasswordDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(
		private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
		private fb: FormBuilder,
		private authService: AuthService,
		private layoutUtilsService: LayoutUtilsService,
		@Inject(MAT_DIALOG_DATA) data) { }

	ngOnInit() {
		this.form = this.fb.group({
            old: ['', Validators.required],
            password: ['', Validators.required],
        });
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	save() {
		this.loadingSubject.next(true);
		const payload = this.form.value;
		this.authService.changePassword(payload).subscribe(
			data => {
				if (data.error || data.error === 'password does not match') {
					const msg = `Your old password is not correct`;
					this.layoutUtilsService.showActionNotification(msg, MessageType.Create, 10000, true, true);
					this.dialogRef.close();
				} else {
					console.log('success reponse', data);
					this.loadingSubject.next(false);
					const message = `Your password is Successfully Updated`;
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
		console.log('save click! changePassword');
		this.dialogRef.close();
	}

	close() {
		this.dialogRef.close();
	}

	getTitle(): string {
		return 'Change Password';
	}
}
