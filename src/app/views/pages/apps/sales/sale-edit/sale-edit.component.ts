// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { SaleModel, SalesService } from '../../../../../core/sales';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { tap, map } from 'rxjs/operators';
import { StatusEditDialogComponent } from './status-edit/status-edit.dialog.component';

// imprts for date hiccup
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports

const moment = _moment;

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-sale-edit',
	templateUrl: './sale-edit.component.html',
	styleUrls: ['./sale-edit.component.scss'],
	providers: [
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
	],
})
export class SaleEditComponent implements OnInit, OnDestroy {
	sale: SaleModel;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldSale: SaleModel;
	saleForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	selectedFile: File = null;
	idParams: string;
	contactsAll: [];
	showModal: boolean = false;
	formError = 'Oops! Change a few things up and try submitting again.';
	invoiceDetails = {
		bank_name: '',
		tin: '',
		account_number: '',
		account_name: '',
	};
	statuses = ['Sales Initiated',
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
		private salesService: SalesService,
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.emptySaleForm();
		this.getContactsAll();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getSaleDetails().subscribe(saleData => this.initSaleForm(saleData));
			this.loadingSubject.next(true);
		} else {
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.saleForm.value);
		console.log('form control', this.saleForm.controls);
	}

	openDialog() {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = false;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '600px';
		const dialogRef = this.dialog.open(StatusEditDialogComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(
			invoiceFormData => {
				this.invoiceDetails = invoiceFormData;
				console.log('Dialog output:', invoiceFormData);
			}
		);
	}

	getContactsAll() {
		this.salesService.getContacts().subscribe(
			contacts => {
				this.contactsAll = contacts['success'];
			},
			error => {
				console.log('error occured', error);
			}
		);
	}

	getSaleDetails() {
		return this.salesService.getSaleById(this.idParams).pipe(
			map(saleDetails => {
				this.sale = saleDetails['success'];
				this.loadingSubject.next(false);
				console.log('retrieving sales with pipe', this.sale);
				return this.sale;
			})
		);
	}

	emptySaleForm() {
		this.saleForm = this.fb.group({
			name: ['', Validators.required],
			quotation_amount: ['', Validators.required],
			status: ['', Validators.required],
			contact_id: ['', Validators.required],
			invoice_amount: [''],
			remark: ['']
		});
	}
	initSaleForm(sale: any = {}) {
		this.saleForm = this.fb.group({
			quotation_amount: [sale.quotation_amount || '', Validators.required],
			status: [sale.status || '', Validators.required],
			invoice_amount: [sale.invoice_amount || '', Validators.required],
			unit: [sale.unit || '', Validators.required],
			remark: ['', Validators.required]
		});
	}
	getComponentTitle() {
		let result = 'Create Sales';
		if (!this.sale || !this.sale._id) {
			return result;
		}
		result = `Edit Sales`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.saleForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.saleForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.sale && this.sale._id) {
			console.log('lead has an Id');
			let editedSale = this.saleForm.value;
			console.log('Sale to send', editedSale);
			this.updateSale(editedSale);
			return;
		}
		this.addSale(this.saleForm.value);
	}

	updateSale(sale) {
		let ivDetails = this.invoiceDetails;
		console.log('iv', ivDetails);
		if (this.saleForm.value.status === 'Completed') {
			if (ivDetails.tin !== '' && ivDetails.bank_name !== '' && ivDetails.account_name !== '' && ivDetails.account_number !== '') {
				const remixedPayload = {
					remark: sale.remark,
					status: sale.status,
					quotation_amount: sale.quotation_amount,
					invoice_amount: sale.invoice_amount,
					unit: sale.unit,
					bank_name: this.invoiceDetails.bank_name,
					tin: this.invoiceDetails.tin,
					account_number: this.invoiceDetails.account_number,
					account_name: this.invoiceDetails.account_name,
				};
				console.log('update times', remixedPayload);
				this.updateSaleData(remixedPayload);
			} else {
				this.loadingSubject.next(false);
				this.hasFormErrors = true;
				this.formError = 'You need to complete the invoice form to continue';
			}
		} else {
			const remixedPayload = {
				remark: sale.remark,
				status: sale.status,
				quotation_amount: sale.quotation_amount,
				invoice_amount: sale.invoice_amount,
				unit: sale.unit,
			};
			this.updateSaleData(remixedPayload);
		}
	}

	updateSaleData(remixedPayload) {
		this.salesService.updateSale(remixedPayload, this.sale._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `New Sale has been Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/sales/sales']);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}
	handleCompletedsDisplay(e) {
		if (this.saleForm.value.status === 'Completed') {
			this.openDialog();
			console.log('Displaying MODAL');
		}
	}
	/**
	 * Add Lead
	 *
	 * @param _lead: LeadModel
	 * @param withBack: boolean
	 */
	addSale(_sale: SaleModel) {
		const remixedPayload = {
			contact_id: _sale.contact_id,
			status: _sale.status,
			quotation_amount: _sale.quotation_amount,
			name: _sale.name
		};
		console.log('remixedPayload', remixedPayload);
		this.loadingSubject.next(true);
		this.salesService.createSale(remixedPayload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `New Sale has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/sales/sales']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	reset() {
		this.sale = Object.assign({}, this.oldSale);
		this.emptySaleForm();
		this.hasFormErrors = false;
		this.saleForm.markAsPristine();
		this.saleForm.markAsUntouched();
		this.saleForm.updateValueAndValidity();
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
