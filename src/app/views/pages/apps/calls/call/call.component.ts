import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CallLogModel, CallsService } from '../../../../../core/calls';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-call',
	templateUrl: './call.component.html',
	styleUrls: ['./call.component.scss']
})
export class CallComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	callId: string;
	callDetails: any;
	pageTitle = 'Please wait...';
	constructor(
		private route: ActivatedRoute,
		private callsService: CallsService,
		private _location: Location,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.callId = this.route.snapshot.params['id'];
		this.callsService.getCallLogById(this.callId).subscribe(
			singleCall => {
				this.callDetails = singleCall['success'];
				console.log('this contact details oninit', this.callDetails);
				this.loadingSubject.next(false);
				this.pageTitle = `${this.callDetails.phone} - ${this.callDetails.type}`;
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
		console.log('id returned', this.route.snapshot.params['id']);
	}

	goBack() {
		this._location.back();
	}

	onDelete() {
		const _title: string = 'Delete Call Log';
		const _description: string = 'Are you sure to permanently delete this Call log?';
		const _waitDesciption: string = 'Deleting Call Log...';
		const _deleteMessage = `Call Log has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.callsService.deleteCallLog(this.callId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/strada/calls/calls']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}
}
