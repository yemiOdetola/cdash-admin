// Angular
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// RxJS
import {  Subscription} from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'kt-status-edit-dialog',
	templateUrl: './status-edit.dialog.component.html'
})
export class StatusEditDialogComponent implements OnInit {
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	form: FormGroup;
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<StatusEditDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(
		private dialogRef: MatDialogRef<StatusEditDialogComponent>,
		private fb: FormBuilder,
		@Inject(MAT_DIALOG_DATA) data) { }

	ngOnInit() {
		this.form = this.fb.group({
            tin: ['', Validators.required],
            account_number: ['', Validators.required],
            account_name: ['', Validators.required],
            bank_name: ['', Validators.required],
        });
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	save() {
		this.dialogRef.close(this.form.value);
		console.log('saved');
	}

	close() {
		this.dialogRef.close(this.form.value);
	}

	getTitle(): string {
		return 'Complete';
	}
}
