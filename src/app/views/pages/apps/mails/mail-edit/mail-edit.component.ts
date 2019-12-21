import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { MailModel, MailsService } from '../../../../../core/mails';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { tap, map } from 'rxjs/operators';

// imprts for date hiccup
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports

const moment = _moment;

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-mail-edit',
	templateUrl: './mail-edit.component.html',
	styleUrls: ['./mail-edit.component.scss'],
	providers: [
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
	],
})
export class MailEditComponent implements OnInit, OnDestroy {
	mail: MailModel;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldMail: MailModel;
	mailForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	selectedFile: File = null;
	idParams: string;
	init: boolean = false;
	sub: any;
	contactsAll: [];
	showModal: boolean = false;
	formError = 'Oops! Change a few things up and try submitting again.';
	invoiceDetails = {
		bank_name: '',
		tin: '',
		account_number: '',
		account_name: '',
	};
	statuses = ['Mails Initiated',
		'Email Sent',
		'Scheduled Meeting',
		'Sent MOU/Proposal',
		'Review MOU/Proposal',
		'Follow Up Requested',
		'Sent Invoice',
		'Signed Agreement',
		'Completed'
	];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private mailsService: MailsService,
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.emptyMailForm();

		this.islogged();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getMailDetails().subscribe(mailData => this.initMailForm(mailData));
			this.loadingSubject.next(true);
		} else {
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.mailForm.value);
		console.log('form control', this.mailForm.controls);
		const sub_id: string = this.activatedRoute.snapshot.queryParamMap.get('sub_id');
		if (sub_id) {
			this.completeauth(sub_id);
		}
	}


	islogged() {
		this.mailsService.getisLogged().subscribe(
			contacts => {
				this.init = true;
				this.sub = contacts.success;
			},
			error => {
				console.log('error occured', error);
				this.init = true;
			}
		);
	}
	logout() {
		this.mailsService.logout().subscribe(
			contacts => {
				//location = (contacts['success']);
				this.sub = null;
			},
			error => {
				console.log('error occured', error);
				this.init = true;
			}
		);
	}
	completeauth(sub_id){
		this.mailsService.completeAuth(sub_id).subscribe(
			contacts => {
				let url: string = this.router.url.substring(0, this.router.url.indexOf("?"));
				 this.router.navigateByUrl(url);
				 this.sub = contacts.success;
			},
			error => {
				console.log('error occured', error);
			}
		);
	}
	auth(){
		this.mailsService.getAuth().subscribe(
			contacts => {
				location = (contacts['success']);
			},
			error => {
				console.log('error occured', error);
			}
		);
	}

	getMailDetails() {
		return this.mailsService.getMailById(this.idParams).pipe(
			map(mailDetails => {
				this.mail = mailDetails['success'];
				this.loadingSubject.next(false);
				console.log('retrieving mails with pipe', this.mail);
				return this.mail;
			})
		);
	}

	emptyMailForm() {
		this.mailForm = this.fb.group({
			name: ['', Validators.required],
			quotation_amount: ['', Validators.required],
			status: ['', Validators.required],
			unit: ['', Validators.required],
			contact_id: ['', Validators.required],
			invoice_amount: [''],
			remark: [''],
		});
	}
	initMailForm(mail: any = {}) {
		this.mailForm = this.fb.group({
			quotation_amount: [mail.quotation_amount || '', Validators.required],
			status: [mail.status || '', Validators.required],
			invoice_amount: [mail.invoice_amount || '', Validators.required],
			unit: [mail.unit || '', Validators.required],
			remark: ['', Validators.required],

		});
	}
	getComponentTitle() {
		let result = 'Create Mails';
		if (!this.mail || !this.mail._id) {
			return result;
		}
		result = `Edit Mails`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.mailForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.mailForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.mail && this.mail._id) {
			console.log('lead has an Id');
			let editedMail = this.mailForm.value;
			console.log('Mail to send', editedMail);
			this.updateMail(editedMail);
			return;
		}
		this.addLead(this.mailForm.value);
	}

	updateMail(mail) {
		let ivDetails = this.invoiceDetails;
		console.log('iv', ivDetails);
		if (this.mailForm.value.status === 'Completed') {
			if (ivDetails.tin !== '' && ivDetails.bank_name !== '' && ivDetails.account_name !== '' && ivDetails.account_number !== '') {
				const remixedPayload = {
					remark: mail.remark,
					status: mail.status,
					quotation_amount: mail.quotation_amount,
					invoice_amount: mail.invoice_amount,
					unit: mail.unit,
					bank_name: this.invoiceDetails.bank_name,
					tin: this.invoiceDetails.tin,
					account_number: this.invoiceDetails.account_number,
					account_name: this.invoiceDetails.account_name,
				};
				console.log('update times', remixedPayload);
				this.updateMailData(remixedPayload);
			} else {
				this.loadingSubject.next(false);
				this.hasFormErrors = true;
				this.formError = 'You need to complete the invoice form to continue';
			}
		} else {
			const remixedPayload = {
				remark: mail.remark,
				status: mail.status,
				quotation_amount: mail.quotation_amount,
				invoice_amount: mail.invoice_amount,
				unit: mail.unit,
			};
			this.updateMailData(remixedPayload);
		}
	}

	updateMailData(remixedPayload) {
		this.mailsService.updateMail(remixedPayload, this.mail._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `New Mail has been Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/mails/mails']);
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
	 * Add Lead
	 *
	 * @param _lead: LeadModel
	 * @param withBack: boolean
	 */
	addLead(_mail: MailModel) {
		const remixedPayload = {
			contact_id: _mail.contact_id,
			status: _mail.status,
			quotation_amount: _mail.quotation_amount,
			unit: _mail.unit
		};
		console.log('remixedPayload', remixedPayload);
		this.loadingSubject.next(true);
		this.mailsService.createMail(remixedPayload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `New Mail has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/mails/mails']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	reset() {
		this.mail = Object.assign({}, this.oldMail);
		this.emptyMailForm();
		this.hasFormErrors = false;
		this.mailForm.markAsPristine();
		this.mailForm.markAsUntouched();
		this.mailForm.updateValueAndValidity();
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
