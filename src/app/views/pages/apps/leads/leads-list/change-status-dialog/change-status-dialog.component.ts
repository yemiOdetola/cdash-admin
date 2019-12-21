// Angular
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../../core/auth';
import { LayoutUtilsService, MessageType } from '../../../../../../core/_base/crud';
import { LeadsService } from '../../../../../../core/leads';

@Component({
	selector: 'kt-change-status-dialog',
	templateUrl: './change-status-dialog.component.html'
})
export class ChangeStatusDialogComponent implements OnInit {
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	form: FormGroup;
	statuses = [
		'Lead Initiated', 'Email Sent', 'Scheduled Meeting', 'Sent MOU/Proposal',
		'Review MOU/Proposal', 'Follow Up Requested', 'Sent Invoice', 'Signed Agreement',
		'Converted to Contact'
	];
	injectedData;
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<ChangeStatusDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(
		private dialogRef: MatDialogRef<ChangeStatusDialogComponent>,
		private fb: FormBuilder,
		private authService: AuthService,
		private layoutUtilsService: LayoutUtilsService,
		private leadsService: LeadsService,
		@Inject(MAT_DIALOG_DATA) data) {
			this.injectedData = data.details;
		 }

	ngOnInit() {
		console.log('injected', this.injectedData);
		this.form = this.fb.group({
			status: ['', Validators.required],
		});
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	save() {
		this.injectedData['status'] = this.form.value.status;
		this.loadingSubject.next(true);
		const lead = this.injectedData;
		console.log('to send', this.injectedData);
		this.leadsService.updateLead(lead, lead._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
		this.dialogRef.close();
	}

	close() {
		this.dialogRef.close();
		this.dialogRef.close();
	}

	getTitle(): string {
		return 'Change Status';
	}
}
