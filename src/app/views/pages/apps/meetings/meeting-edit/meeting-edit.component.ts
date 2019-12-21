// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { MeetingModel, MeetingsService } from '../../../../../core/meetings';
import { LeadsService } from '../../../../../core/leads';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';
import * as _moment from 'moment';

const moment = _moment;

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-meeting-edit',
	templateUrl: './meeting-edit.component.html',
	styleUrls: ['./meeting-edit.component.scss']
})
export class MeetingEditComponent implements OnInit, OnDestroy {
	meeting: MeetingModel;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldCMeeting: MeetingModel;
	meetingForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	selectedFile: File = null;
	idParams: string;
	meetingTypes = ['Internal', 'External'];
	internal = false;
	external = false;
	leads = [];
	switchInstruction = true;
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private leadsService: LeadsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private meetingsService: MeetingsService
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.initMeetingForm();
		this.getAllLeads();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getMeetingDetails().subscribe(meetingData => this.initMeetingForm(meetingData));
			this.loadingSubject.next(true);
		} else {
			this.meeting = this.meetingForm.value;
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.meetingForm.value);
		console.log('form control', this.meetingForm.controls);
	}

	getAllLeads() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.leadsService.getLeadsEvery().subscribe(
			responseData => {
				this.leads = responseData['success'];
				this.loadingSubject.next(false);
				console.log('all leads returned', this.leads);
			},
			error => {
				console.log('error', error);
			});
	}

	getMeetingDetails() {
		return this.meetingsService.getMeetingById(this.idParams).pipe(
			map(meetingDetails => {
				this.meeting = meetingDetails['success'];
				this.loadingSubject.next(false);
				console.log('retrieving meeting with pipe', this.meeting);
				return this.meeting;
			})
		);
	}

	initMeetingForm(meeting: any = {}) {
		let startDate = moment(meeting.start).format('YYYY-MM-DD');
		this.meetingForm = this.fb.group({
			type: [meeting.type || '', Validators.required],
			name: [meeting.name || '', Validators.required],
			lead_id: [''],
			description: [meeting.description || '', Validators.required],
			start: [startDate || '', Validators.required],
			timeString: [meeting.time || '', Validators.required],
			duration: [meeting.duration || '', Validators.required]
		});
	}

	getComponentTitle() {
		let result = 'Please Wait';
		if (!this.meeting || !this.meeting._id) {
			result = 'Create New Meeting';
			return result;
		}
		result = `Edit Meeting Details`;
		return result;
	}

	timeStringToFloat(time) {
		let hrsMinutes = time.split(':');
		const hrs = hrsMinutes[0];
		const mins = hrsMinutes[1];
		let total = hrs + '.' + mins;
		return total;
	}

	parseTotime(time) {
		if (typeof time !== 'undefined') {
			let hrsMinutes = time.split('.');
			const hrs = hrsMinutes[0];
			const mins = hrsMinutes[1];
			let total = hrs + ':' + mins;
			return total;
		}
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.meetingForm.controls;
		this.loadingSubject.next(true);
		console.log(this.meetingForm.value);
		/** check form */
		if (this.meetingForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.meeting && this.meeting._id) {
			console.log('Meeting has an Id');
			let editedMeeting = this.meetingForm.value;
			console.log('Meeting to send', editedMeeting);
			this.updateMeeting(editedMeeting);
			return;
		}
		this.addMeeting(this.meetingForm.value);
	}

	updateMeeting(meeting) {
		let payload = {};
		const start = this.timeStringToFloat(meeting.start);
		const description = meeting.description;
		const duration = meeting.duration;
		const name = meeting.name;
		const lead_id = this.meetingForm.value.lead_id;
		const type = this.meetingForm.value.type;
		payload = { ...payload, start, duration, description, name, lead_id, type };
		this.meetingsService.updateMeeting(payload, this.meeting._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Updated Successfully`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/meetings/meetings']);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}
	/**
	 * Add Meeting
	 *
	 * @param _meeting: MeetingModel
	 * @param withBack: boolean
	 */
	addMeeting(_meeting: MeetingModel) {
		this.loadingSubject.next(true);
		let payload = {};
		const timeString = this.timeStringToFloat(this.meetingForm.value.timeString);
		const d = new Date(this.meetingForm.value.start).getTime();
		const lead_id = this.meetingForm.value.lead_id;
		const type = this.meetingForm.value.type;
		console.log(this.meetingForm.value.timeString, 'dtart', d, 'timeString');
		new Date(d).setHours(parseInt(timeString.split('.')[0]));
		new Date(d).setMinutes(parseInt(timeString.split('.')[0]));
		// d.setHours(timeString.split('.')[0]);
		// d.setMinutes(timeString.split('.')[1]);
		// tslint:disable-next-line: radix
		// d.setHours(parseInt(timeString.split('.')[0]));
		// tslint:disable-next-line: radix
		// d.setMinutes(parseInt(timeString.split('.')[1]));
		const description = this.meetingForm.value.description;

		const duration = this.meetingForm.value.duration;
		const name = this.meetingForm.value.name;
		payload = { ...payload, start: moment(d).valueOf(), duration, description, name, lead_id, type };
		this.meetingsService.createMeeting(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `Meeting has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/meetings/meetings']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	reset() {
		this.meeting = Object.assign({}, this.oldCMeeting);
		this.initMeetingForm();
		this.hasFormErrors = false;
		this.meetingForm.markAsPristine();
		this.meetingForm.markAsUntouched();
		this.meetingForm.updateValueAndValidity();
	}

	/**
	 * Close alert
	 *
	 * @param $event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	switchMeetingType(e) {
		if (this.meetingForm.value.type === 'External') {
			this.external = true;
		} else {
			this.external = false;
		}
	}

	toggleInstruction() {
		this.switchInstruction = !this.switchInstruction;
	}

	ngOnDestroy() { }

}
