import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SaleModel, SalesService } from '../../../../../core/sales';
import { ContactsService } from '../../../../../core/contacts';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';

@Component({
	selector: 'kt-sale',
	templateUrl: './sale.component.html',
	styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	saleId: string;
	saleDetails: any;
	pageTitle = 'Please wait...';
	contactName: string;
	dataSourceInvoice: any;
	dataSourceMOU: any;
	dataSourceQuotation: any;
	invoiceColumns: string[] = ['Invoice Id', 'Amount', 'Unit', 'TIN', 'Subject'];
	MOUcolumns: any = ['MOU', 'Quotation Amount', 'Unit',];
	quotationsColumns: any = ['Subject', 'Body', 'Amount', 'Unit', 'TIN'];
	fileName;
	togUpload;
	fSelected;
	mouDetails;
	mouForm: FormGroup;
	invoiceForm: FormGroup;
	quotationForm: FormGroup;
	receiptForm: FormGroup;
	toggInvoice;
	toggMOU;
	toggQuotation;
	toggReceipt;
	contactId = '';
	contactEmail = '';
	invoiceList;
	mouList;
	quotationsList;
	activeTab = 'invoice';
	showpart2 = false;
	showing = 'invoices';
	contactDetails;
	downloadInvoice = false;
	constructor(
		private route: ActivatedRoute,
		private salesService: SalesService,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router,
		private fb: FormBuilder,
		private _location: Location,
		private contactsService: ContactsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.saleId = this.route.snapshot.params['id'];
		this.initMOUForm();
		this.initInvoiceForm();
		this.initQuotationForm();
		this.initReceiptForm();
		this.getSaleDetails();
		this.getInvoices(this.saleId);
		this.getMOUs(this.saleId);
		this.getQuotations(this.saleId);
		console.log('id returned', this.route.snapshot.params['id']);
	}

	activateTab(tab) {
		if (this.activeTab !== tab) {
			this.activeTab = tab;
			return;
		}
	}

	showInvoice() {
		this.getInvoice(this.saleId);
		// if (!this.invoiceForm.valid) {
		// 	return alert('Invoice not correctly filled');
		// }
		// let obj = {};
		// const contact = this.contactDetails;
		// localStorage.setItem('invoiceData', JSON.stringify(this.invoiceForm.value));
		// console.log(this.invoiceForm.value);
		// this.router.navigate([]).then(result => {  window.open('/strada/sales/preview', '_blank'); });

	}

	goBack() {
		this._location.back();
	}

	showPage2() {
		this.showpart2 = !this.showpart2;
		return;
	}

	getSaleDetails() {
		this.salesService.getSaleById(this.saleId).subscribe(
			singleSale => {
				this.saleDetails = singleSale['success'];
				this.getContactDetails(this.saleDetails.contact_id);
				console.log('this lead details oninit', this.saleDetails);
				this.loadingSubject.next(false);
				this.pageTitle = `Sales Details`;
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
	}

	initMOUForm() {
		this.mouForm = this.fb.group({
			message: ['', Validators.required]
		});
	}

	initInvoiceForm() {
		this.invoiceForm = this.fb.group({
			subject: ['', Validators.required],
			service_description: ['', Validators.required],
			body: ['', Validators.required],
			tin: ['', Validators.required],
			bank_name: ['', Validators.required],
			account_name: ['', Validators.required],
			account_number: ['', Validators.required],
			amount: ['', Validators.required],
			unit: ['', Validators.required],
		});
	}
	initQuotationForm() {
		this.quotationForm = this.fb.group({
			tin: [''],
			description: ['', Validators.required],
			amount: ['', Validators.required],
			body: ['', Validators.required],
			subject: ['', Validators.required],
			unit: ['', Validators.required]
		});
	}

	initReceiptForm() {
		this.receiptForm = this.fb.group({
			subject: ['', Validators.required],
			body: ['', Validators.required],
			amount: ['', Validators.required],
			description: ['', Validators.required],
			remark: ['', Validators.required]
		});
	}

	getContactDetails(id) {
		this.contactsService.getContactById(id).subscribe(
			singleContact => {
				this.contactDetails = singleContact['success'];
				console.log('name comtavt', singleContact['success'].name);
				this.contactName = singleContact['success'].name;
				this.contactId = singleContact['success']._id;
				this.contactEmail = singleContact['success'].email;
			},
			error => {
				console.log('Error getting contact details', error);
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.loadingSubject.next(false);
			}
		);
	}

	onDelete() {
		const _title: string = 'Delete Sale';
		const _description: string = 'Are you sure to permanently delete this Sale?';
		const _waitDesciption: string = 'Sale will be deleting...';
		const _deleteMessage = `lead has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.salesService.deleteSale(this.saleId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/strada/sales/sales']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}

	sendMOU() {
		this.loadingSubject.next(true);
		let payload = new FormData();
		payload.append('file', this.fSelected, this.fSelected.name);
		payload.append('message', this.mouForm.value.message);
		this.salesService.sendMOU(payload, this.saleId).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				if (data['error']) {
					const message = 'Sorry, Temporary Error Occured';
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				} else {
					this.loadingSubject.next(true);
					const message = `Successful. MOU has been sent.`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
					this.getSaleDetails();
					this.getMOUs(this.saleId);
				}
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	sendInvoice() {
		this.loadingSubject.next(true);
		let payload = {
			subject: this.invoiceForm.value.subject,
			service_description: this.invoiceForm.value.service_description,
			body: this.invoiceForm.value.body,
			tin: this.invoiceForm.value.tin,
			bank_name: this.invoiceForm.value.bank_name,
			account_name: this.invoiceForm.value.account_name,
			account_number: this.invoiceForm.value.account_number,
			amount: this.invoiceForm.value.amount,
			unit: this.invoiceForm.value.unit,
			email: this.contactEmail
		};
		// const fullPayload = {...payload, formPayload, email: this.contactEmail};
		// const payload = this.invoiceForm.value;
		console.log('fullPayload invoice', payload);
		this.salesService.sendInvoice(payload, this.saleId, this.contactId).subscribe(
			data => {
				console.log('success reponse', data);
				if (data['error']) {
					this.loadingSubject.next(true);
					const message = 'Sorry, Temporary Error Occured';
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
					this.getSaleDetails();
				} else {
					this.loadingSubject.next(false);
					const message = `Successful. Invoice has been sent.`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
					this.downloadInvoice = true;
					this.getContactDetails(this.contactId);
					this.invoiceForm.markAsPristine();
					this.invoiceForm.markAsUntouched();
					this.loadingSubject.next(false);
				}
			},
			error => {
				this.loadingSubject.next(true);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	sendQuotation() {
		this.loadingSubject.next(true);
		let payload = {
			tin: (this.quotationForm.value.tin) ? this.quotationForm.value.tin : '',
			subject: this.quotationForm.value.subject,
			body: this.quotationForm.value.body,
			email: this.contactEmail,
			description: this.quotationForm.value.description,
			amount: this.quotationForm.value.amount,
			unit: this.quotationForm.value.unit,
		};
		console.log('fullPayload invoice', payload);
		this.salesService.sendQuotation(payload, this.saleId, this.contactId).subscribe(
			data => {
				console.log('success reponse', data);
				if (data['error']) {
					const message = 'Sorry, Temporary Error Occured';
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				} else {
					this.loadingSubject.next(false);
					const message = `Successful. Quotation has been sent.`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
					this.getContactDetails(this.contactId);
					this.invoiceForm.markAsPristine();
					this.invoiceForm.markAsUntouched();
				}
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	sendReceipt() {
		this.loadingSubject.next(true);
		let payload = {
			subject: this.receiptForm.value.subject,
			body: this.receiptForm.value.body,
			amount: this.receiptForm.value.amount,
			description: this.receiptForm.value.description,
			remark: this.receiptForm.value.remark
		};
		console.log('fullPayload receipt', payload);
		this.salesService.sendReceipt(payload, this.saleId, this.contactId).subscribe(
			data => {
				console.log('success reponse', data);
				if (data['error']) {
					const message = 'Sorry, Temporary Error Occured';
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				} else {
					this.loadingSubject.next(false);
					const message = `Successful. Receipt has been sent.`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
					this.getContactDetails(this.contactId);
					this.invoiceForm.markAsPristine();
					this.invoiceForm.markAsUntouched();
				}
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	getInvoice(saleId) {
		this.salesService.downloadInvoice(saleId, this.contactId).subscribe(
			invoice => {
				console.log('Invoice retrieved', invoice);
				let file = new Blob([invoice], { type: 'application/pdf' });
				let fileURL = URL.createObjectURL(file);
				console.log(fileURL);
				window.open(fileURL);
				this.loadingSubject.next(false);
			},
			error => {
				console.log('Invoice retrieved', error);
				let file = new Blob([error], { type: 'application/pdf' });
				let fileURL = URL.createObjectURL(file);
				console.log(fileURL);
				window.open(fileURL);
				const message = 'Sorry, Could not retrieve MOUs';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
		console.log('id returned', this.route.snapshot.params['id']);
	}

	getMOUs(saleId) {
		this.salesService.getMOUs(saleId).subscribe(
			salesMOU => {
				this.mouList = salesMOU['success'];
				this.dataSourceMOU = new MatTableDataSource<any>(this.mouList);
				console.log('salesMOU salesMOU', salesMOU);
				// console.log('this contact details oninit', this.contactDetails);
				this.loadingSubject.next(false);
			},
			error => {
				const message = 'Sorry, Could not retrieve MOUs';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
		console.log('id returned', this.route.snapshot.params['id']);
	}

	showTable(table) {
		this.showing = table;
	}

	getInvoices(saleId) {
		this.salesService.getInvoices(saleId).subscribe(
			salesMOU => {
				this.invoiceList = salesMOU['success'];
				this.dataSourceInvoice = new MatTableDataSource<any>(this.invoiceList);
				console.log('salesInvoices salesInvoices', salesMOU);
				this.loadingSubject.next(false);
			},
			error => {
				const message = 'Sorry, Could not retrieve Invoices';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
		console.log('id returned', this.route.snapshot.params['id']);
	}

	getQuotations(saleId) {
		this.salesService.getQuotation(saleId).subscribe(
			salesQuotes => {
				this.quotationsList = salesQuotes['success'];
				this.dataSourceQuotation = new MatTableDataSource<any>(this.quotationsList);
				console.log('salesQuotes salesQuotes', salesQuotes);
				this.loadingSubject.next(false);
			},
			error => {
				const message = 'Sorry, Could not retrieve Quotations';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
		console.log('id returned', this.route.snapshot.params['id']);
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
	toggleMOU() {
		this.toggReceipt = false;
		this.toggInvoice = false;
		this.toggQuotation = false;
		this.toggMOU = !this.toggMOU;
	}
	toggleInvoice() {
		this.toggMOU = false;
		this.toggReceipt = false;
		this.toggQuotation = false;
		this.toggInvoice = !this.toggInvoice;
	}
	toggleQuotation() {
		this.toggMOU = false;
		this.toggInvoice = false;
		this.toggReceipt = false;
		this.toggQuotation = !this.toggQuotation;
	}
	toggleReceipt() {
		this.toggMOU = false;
		this.toggInvoice = false;
		this.toggQuotation = false;
		this.toggReceipt = !this.toggReceipt;
	}
}
