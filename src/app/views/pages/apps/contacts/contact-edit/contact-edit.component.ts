// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { ContactModel, ContactsService } from '../../../../../core/contacts';
import * as countries from './countries.json';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-contact-edit',
	templateUrl: './contact-edit.component.html',
	styleUrls: ['./contact-edit.component.scss']
})
export class ContactEditComponent implements OnInit, OnDestroy {
	contact: ContactModel;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldContact: ContactModel;
	contactForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	objectKeys = Object.keys;
	county;
	countriesObj = countries;
	selectedTab: number = 0;
	selectedFile: File = null;
	idParams: string;
	fSelected;
	fileName = '';
	switchInstruction = true;
	titles = ['Mrs.', 'Mr.', 'Dr.', 'Miss'];
	ratings = ['pending', 'invoice', 'ready', 'commited', 'scammer'];
	sources = [
		'Advertisement', 'Code Call', 'Employee Referral', 'External Referrer',
		'Online Store', 'Partner', 'Public Relations', 'Sales Email Alias',
		'Seminar Partner', 'Trade Show', 'Web Download', 'Web Research', 'Chat'
	];
	statuses = [
		'Lead Initiated', 'Email Sent', 'Scheduled Meeting', 'Sent MOU/Proposal',
		'Review MOU/Proposal', 'Follow Up Requested', 'Sent Invoice', 'Signed Agreement',
		'Converted to Contact'
	];
	industries = [
		'Others', 'ASP (Application Service Provider)', 'Data/Telecom OEM',
		'ERP (Enterprise Resource Planning)', 'Goverment/Miltary', 'Large Enterprise',
		'Management ISV', 'Network Equipment Enterprise', 'Non-Management ISV',
		'Optical Networking', 'Service Provider', 'Small/Medium Enterprise', 'Storage Equipment', 'Storage Service Provider', 'System Integrator', 'Wireless Industry'
	];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private contactsService: ContactsService
	) {
		this.county = Object.keys(this.countriesObj);
	}

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.initContactForm();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getContactDetails().subscribe(contactData => this.initContactForm(contactData));
			this.loadingSubject.next(true);
		} else {
			this.contact = this.contactForm.value;
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.contactForm.value);
		console.log('form control', this.contactForm.controls);
	}

	getContactDetails() {
		return this.contactsService.getContactById(this.idParams).pipe(
			map(contactDetails => {
				this.contact = contactDetails['success'];
				this.loadingSubject.next(false);
				console.log('retrieving contacts with pipe', this.contact);
				return this.contact;
			})
		);
	}

	initContactForm(contact: any = {}) {
		this.contactForm = this.fb.group({
			title: [contact.title || ''],
			name: [contact.name || '', Validators.required],
			source: [contact.source || '', Validators.required],
			status: [contact.status || 'Converted to Contact'],
			website: [contact.website || ''],
			company: [contact.company || '', Validators.required],
			email: [contact.email || '', Validators.required],
			industry: [contact.industry || '', Validators.required],
			phone: [contact.phone || '', Validators.required],
			country: [contact.country || 'NG'],
			phone2: [contact.phone2 || ''],
			file: [''],
			address: [contact.address || '', Validators.required],
			description: [contact.description || ''],
		});
	}

	getComponentTitle() {
		let result = 'Please Wait';
		if (!this.contact || !this.contact._id) {
			result = 'Create New Contact';
			return result;
		}
		result = `Edit Contact -  ${this.contact.name}`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.contactForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.contactForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.contact._id) {
			console.log('Contact has an Id');
			let editedContact = this.contactForm.value;
			console.log('Contact to send', editedContact);
			this.updateContact(editedContact);
			return;
		}
		this.addContact(this.contactForm.value);
	}

	updateContact(contact) {
		let updPayload = new FormData();
		updPayload.append('name', this.contactForm.get('name').value);
		updPayload.append('title', this.contactForm.get('title').value);
		updPayload.append('source', this.contactForm.get('source').value);
		updPayload.append('status', this.contactForm.get('status').value);
		updPayload.append('website', this.contactForm.get('website').value);
		updPayload.append('company', this.contactForm.get('company').value);
		updPayload.append('email', this.contactForm.get('email').value);
		updPayload.append('industry', this.contactForm.get('industry').value);
		updPayload.append('phone', this.contactForm.get('phone').value);
		updPayload.append('country', this.contactForm.get('country').value);
		updPayload.append('phone2', this.contactForm.get('phone2').value);
		updPayload.append('address', this.contactForm.get('address').value);
		updPayload.append('description', this.contactForm.get('description').value);
		if (this.fSelected) {
			updPayload.append('file', this.fSelected, this.fSelected.name);
		}
		this.contactsService.updateContact(updPayload, this.contact._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `New Contact has been Successfully Updated`;
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
	addContact(_contact: ContactModel) {
		this.loadingSubject.next(true);
		const payload = this.contactForm.value;
		console.log(payload);
		let updPayload = new FormData();
		updPayload.append('name', this.contactForm.get('name').value);
		updPayload.append('title', this.contactForm.get('title').value);
		updPayload.append('source', this.contactForm.get('source').value);
		updPayload.append('status', this.contactForm.get('status').value);
		updPayload.append('website', this.contactForm.get('website').value);
		updPayload.append('company', this.contactForm.get('company').value);
		updPayload.append('email', this.contactForm.get('email').value);
		updPayload.append('industry', this.contactForm.get('industry').value);
		updPayload.append('phone', this.contactForm.get('phone').value);
		updPayload.append('country', this.contactForm.get('country').value);
		updPayload.append('phone2', this.contactForm.get('phone2').value);
		updPayload.append('address', this.contactForm.get('address').value);
		updPayload.append('description', this.contactForm.get('description').value);
		if (this.fSelected) {
			updPayload.append('file', this.fSelected, this.fSelected.name);
		}
		this.contactsService.createContact(updPayload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `New Contact has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/contacts/contacts']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	reset() {
		this.contact = Object.assign({}, this.oldContact);
		this.initContactForm();
		this.hasFormErrors = false;
		this.contactForm.markAsPristine();
		this.contactForm.markAsUntouched();
		this.contactForm.updateValueAndValidity();
	}

	// onFileChange(event) {
	// 	this.selectedFile = event.target.files[0];
	// 	let file: File = event.target.files[0];
	// 	// console.log(this.selectedFile);
	// 	console.log(file);
	// 	// let fd: FormData = new FormData();
	// 	// fd.append('image', file);
	// 	// console.log(fd);
	// 	this.contactForm.patchValue({
	// 		image: file
	// 	});
	// }

	onFileChange(event) {
		if (event.target.files.length > 0) {
			const fileSelected: File = event.target.files[0];
			this.fSelected = fileSelected;
			this.fileName = fileSelected.name;
			console.log('fileSelected', fileSelected['originFileObj']);
			// this.contactForm.get('file').setValue(fileSelected);
		}
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

	toggleInstruction() {
		this.switchInstruction = !this.switchInstruction;
	}

}
