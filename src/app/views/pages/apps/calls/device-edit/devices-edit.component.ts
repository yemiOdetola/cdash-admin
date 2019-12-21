// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { DeviceModel, CallsService } from '../../../../../core/calls';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-devices-edit',
	templateUrl: './devices-edit.component.html',
	styleUrls: ['./devices-edit.component.scss']
})
export class DevicesEditComponent implements OnInit, OnDestroy {
	device: DeviceModel;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldCall: DeviceModel;
	deviceForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	idParams: string;
	campaignTypes = [];
	callTypes = ['INCOMING', 'OUTGOING'];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private callsService: CallsService
	) {
	}

	ngOnInit() {
		this.callsService.getCampaignTypes().subscribe(
			campaigns => {
				this.campaignTypes = campaigns['success'];
				console.log('campaign types', this.campaignTypes);
			}
		);
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.initDeviceForm();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getDeviceDetails().subscribe(deviceData => this.initDeviceForm(deviceData));
			this.loadingSubject.next(true);
		} else {
			this.device = this.deviceForm.value;
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.deviceForm.value);
		console.log('form control', this.deviceForm.controls);
	}
	// contact
	getDeviceDetails() {
		return this.callsService.getDeviceById(this.idParams).pipe(
			map(deviceDetails => {
				this.device = deviceDetails['success'];
				this.loadingSubject.next(false);
				console.log('retrieving device with pipe', this.device);
				return this.device;
			})
		);
	}


	initDeviceForm(device: any = {}) {
		this.deviceForm = this.fb.group({
			name: [device.name || '', Validators.required],
			device_id: [device.device_id || '', Validators.required],
			phone: [device.phone || '', Validators.required],
		});
	}

	getComponentTitle() {
		let result = 'Please Wait';
		if (this.device) {
			result = `Edit Device -  ${this.device.device_id}`;
			return result;
		}
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.deviceForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.deviceForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		let editedDevice = this.deviceForm.value;
		this.updateDevice(editedDevice);
		console.log('Call to send', editedDevice);
		return;
	}

	updateDevice(call) {
		this.callsService.updateDevice(call, this.device._id).subscribe(
			data => {
				this.loadingSubject.next(false);
				const message = `Device log has been Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/calls/devices']);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}


	reset() {
		this.device = Object.assign({}, this.oldCall);
		this.initDeviceForm();
		this.hasFormErrors = false;
		this.deviceForm.markAsPristine();
		this.deviceForm.markAsUntouched();
		this.deviceForm.updateValueAndValidity();
	}

	/**
	 * Close alert
	 *
	 * @param $event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() { }

}
