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
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.emptyTurnoverForm();
		this.getOrganizationDetails();
	}

	getOrganizationDetails() {
		console.log('start gettting org detail');
		this.organizationsService.getOrganization().subscribe(organizationDetails => {
			console.log('organization details full', organizationDetails);
			this.organizationDetails = organizationDetails['data'];
			const turnovers = organizationDetails['data'].turnOvers;
			this.initTurnoverForm(turnovers);
			this.loadingSubject.next(false);
		});
	}

	selectMenu(item) {
		return this.selected = item;
	}


	initTurnoverForm(turnover) {
		this.turnoverForm = this.fb.group({
			currency: [this.organizationDetails.currency || 'naira'],
			year12: [turnover[0].turnover || ''],
			year13: [turnover[1].turnover || ''],
			year14: [turnover[2].turnover || ''],
			year15: [turnover[3].turnover || ''],
			year16: [turnover[4].turnover || ''],
			year17: [turnover[5].turnover || ''],
			year18: [turnover[6].turnover || ''],
			year19: [turnover[7].turnover || ''],
			year20: [turnover[8].turnover || ''],
		});
	}

	emptyTurnoverForm() {
		this.turnoverForm = this.fb.group({
			currency: ['naira' || ''],
			year12: [''],
			year13: [''],
			year14: [''],
			year15: [''],
			year16: [''],
			year17: [''],
			year18: [''],
			year19: [''],
			year20: [''],
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
		if (this.turnover && this.turnover._id) {
			console.log('lead has an Id');
			let editedLead = this.turnoverForm.value;
			console.log('lead to send', editedLead);
			this.updateTurnover();
			return;
		}
		this.addTurnover();
	}

	addTurnover() {
		console.log('initialized add');
		const turnovers = this.turnoverForm.value;
		const turnover = [
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
			{
				'turnover': turnovers.year20,
				'year': 2020
			},
		];
		let ppayload = {
			turnover: turnover,
			currency: this.turnoverForm.get('currency').value
		};
		this.organizationsService.addTurnovers(ppayload).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Turnover successfully added`;
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
		console.log('initialized edit');
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
			{
				'turnover': turnovers.year20,
				'year': 2020
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
