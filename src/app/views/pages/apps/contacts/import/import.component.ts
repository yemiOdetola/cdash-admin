import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { UploadService } from '../../../../../core/upload';
import { Router } from '@angular/router';

@Component({
	selector: 'kt-contacts-import',
	templateUrl: './import.component.html',
	styleUrls: ['./import.component.scss']
})
export class ContactsImportComponent implements OnInit {
	fSelected;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	fileName = '';
	switchInstruction = false;
	constructor(
		private layoutUtilsService: LayoutUtilsService,
		private uploadService: UploadService,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.loadingSubject.next(false);
	}
	// /v1/api/lead/csv
	uploadfile() {
		let payload = new FormData();
		payload.append('file', this.fSelected, this.fSelected.name);
		this.uploadService.uploadContacts(payload).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Upload was Successful`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/contacts/contacts']);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	toggleInstruction() {
		this.switchInstruction = !this.switchInstruction;
	}

	onFileChange(event) {
		if (event.target.files.length > 0) {
			const fileSelected: File = event.target.files[0];
			this.fSelected = fileSelected;
			console.log('fileSelected ', this.fSelected);
			this.fileName = fileSelected.name;
			console.log('fileSelected name', fileSelected);
		}
	}
}
