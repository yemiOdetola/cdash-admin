import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceModel, CallsService } from '../../../../../core/calls';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-device',
	templateUrl: './device.component.html',
	styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	deviceId: string;
	deviceDetails: any;
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
		this.deviceId = this.route.snapshot.params['id'];
		this.callsService.getDeviceById(this.deviceId).subscribe(
			singleDevice => {
				this.deviceDetails = singleDevice['success'];
				console.log('this devic details oninit', this.deviceDetails);
				this.loadingSubject.next(false);
				this.pageTitle = `${this.deviceDetails.phone} - ${this.deviceDetails.device_id}`;
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
		const _title: string = 'Delete Device';
		const _description: string = 'Are you sure to permanently delete the Device?';
		const _waitDesciption: string = 'Deleting Device...';
		const _deleteMessage = `Device has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.callsService.deleteDevice(this.deviceId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/strada/calls/devices']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}
}
