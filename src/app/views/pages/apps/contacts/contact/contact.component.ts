import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactModel, ContactsService } from '../../../../../core/contacts';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { SalesService } from '../../../../../core/sales';
import { Location } from '@angular/common';

import { MatTableDataSource } from '@angular/material/table';

@Component({
	selector: 'kt-contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	contactId: string;
	contactDetails: any;
	pageTitle = 'Please wait...';
	dataSourceInvoice: any;
	dataSourceMOU: any;
	dataSourceQuotation: any;
	invoiceColumns: string[] = ['Invoice Id', 'Amount', 'Unit', 'TIN', 'Subject'];
	MOUcolumns: any = ['MOU', 'Quotation Amount', 'Unit', ];
	quotationsColumns: any = ['Subject', 'Body', 'Amount', 'Unit' , 'TIN'];
	invoiceList;
	mouList;
	quotationsList;
	activeTab = 'invoice';
	showpart2 = false;
	showing = 'mous';
	constructor(
		private route: ActivatedRoute,
		private contactsService: ContactsService,
		private _location: Location,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router,
		private salesService: SalesService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.contactId = this.route.snapshot.params['id'];
		this.getInvoices(this.contactId);
		this.getMOUs(this.contactId);
		this.getQuotations(this.contactId);
		this.contactsService.getContactById(this.contactId).subscribe(
			singleContact => {
				this.contactDetails = singleContact['success'];
				console.log('this contact details oninit', this.contactDetails);
				this.loadingSubject.next(false);
				this.pageTitle = `${this.contactDetails.company} - ${this.contactDetails.status}`;
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
		const _title: string = 'Delete Contact';
		const _description: string = 'Are you sure to permanently delete this Contact?';
		const _waitDesciption: string = 'Deleting Contact...';
		const _deleteMessage = `Contact has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.contactsService.deleteContact(this.contactId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/strada/contacts/contacts']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}

	showTable(table) {
		this.showing = table;
	}

	getMOUs(contactId) {
		this.loadingSubject.next(true);
		this.contactsService.getMOUs(contactId).subscribe(
			salesMOU => {
				this.mouList = salesMOU['success'];
				const singleMOUList = new Array(this.mouList[0]);
				console.log('singleMOUList', singleMOUList);
				this.dataSourceMOU = new MatTableDataSource<any>(singleMOUList);
				console.log('salesMOU salesMOU', salesMOU);
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

	getInvoices(contactId) {
		this.loadingSubject.next(true);
		this.contactsService.getInvoices(contactId).subscribe(
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
		this.loadingSubject.next(true);
		this.contactsService.getQuotation(saleId).subscribe(
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

}
