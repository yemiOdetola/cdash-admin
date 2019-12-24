// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { OrganizationsService } from '../../../../../core/organizations';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-organization',
	templateUrl: './organization.component.html',
	styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	claimRoles;
	users = [];
	allUsers;
	roleSelect = true;
	hodsUsers;
	currentHOD = 0;
	selected = 'organization';
	organizationDetails;
	hasFormErrors: boolean = false;
	turnoverForm: FormGroup;
	turnover;
	constructor(
		private layoutUtilsService: LayoutUtilsService,
		private fb: FormBuilder,
		private organizationsService: OrganizationsService,
		private _location: Location,
		private router: Router) { }

	ngOnInit() {
		this.emptyTurnoverForm();
		this.getOrganizationDetails();
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
	}

	getOrganizationDetails() {
		console.log('start gettting org detail');
		this.organizationsService.getOrganization().subscribe(organizationDetails => {
			console.log('organization details full', organizationDetails);
			this.organizationDetails = organizationDetails['data'];
			this.initTurnoverForm(this.organizationDetails);
			this.loadingSubject.next(false);
		});
	}

	selectMenu(item) {
		return this.selected = item;
	}
	initTurnoverForm(turnover) {
		this.turnoverForm = this.fb.group({
			year12: [turnover.year[0] || ''],
			year13: [turnover.year[1] || ''],
			year14: [turnover.year[2] || ''],
			year15: [turnover.year[3] || ''],
			year16: [turnover.year[4] || ''],
			year17: [turnover.year[5] || ''],
			year18: [turnover.year[6] || ''],
			year19: [turnover.year[7] || ''],
		});
	}

	emptyTurnoverForm() {
		this.turnoverForm = this.fb.group({
			year12: [''],
			year13: [''],
			year14: [''],
			year15: [''],
			year16: [''],
			year17: [''],
			year18: [''],
			year19: [''],
		});
	}

	replaceUnderscore(string) {
		return string.replace('_', ' ');
	}

	goBack() {
		this._location.back();
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.turnoverForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.turnoverForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			return;
		}
		if (this.turnover._id) {
			console.log('lead has an Id');
			let editedLead = this.turnoverForm.value;
			console.log('lead to send', editedLead);
			this.updateTurnover();
			return;
		}
		this.addTurnover();
	}

	addTurnover() {
		const turnovers = this.turnoverForm.value;
		const payload = [
			{
				'turnover': turnovers.year12,
				'year': 2012
			},
			{
				'turnover': turnovers.year13,
				'year': 2013
			},
			{
				'turnover': turnovers.year14,
				'year': 2014
			},
			{
				'turnover': turnovers.year15,
				'year': 2015
			},
			{
				'turnover': turnovers.year16,
				'year': 2016
			},
			{
				'turnover': turnovers.year17,
				'year': 2017
			},
			{
				'turnover': turnovers.year18,
				'year': 2018
			},
			{
				'turnover': turnovers.year19,
				'year': 2019
			},
		];
		this.organizationsService.addTurnovers(payload).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Turnover successfully updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	updateTurnover() {
		const turnovers = this.turnoverForm.value;
		const payload = [
			{
				'turnover': turnovers.year12,
				'year': 2012
			},
			{
				'turnover': turnovers.year13,
				'year': 2013
			},
			{
				'turnover': turnovers.year14,
				'year': 2014
			},
			{
				'turnover': turnovers.year15,
				'year': 2015
			},
			{
				'turnover': turnovers.year16,
				'year': 2016
			},
			{
				'turnover': turnovers.year17,
				'year': 2017
			},
			{
				'turnover': turnovers.year18,
				'year': 2018
			},
			{
				'turnover': turnovers.year19,
				'year': 2019
			},
		];
		this.organizationsService.addTurnovers(payload).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Turnover successfully updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
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
		this.initTurnoverForm(this.turnover);
		this.hasFormErrors = false;
		this.turnoverForm.markAsPristine();
		this.turnoverForm.markAsUntouched();
		this.turnoverForm.updateValueAndValidity();
	}

	ngOnDestroy() { }
}
