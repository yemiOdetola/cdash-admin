// Angular
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'kt-show-invoice',
	templateUrl: './show-invoice.component.html',
})
export class ShowInvoiceComponent implements OnInit {
	invoiceData;
	date;
	constructor() { }

	ngOnInit() {
		this.date = Date.now();
		this.invoiceData = JSON.parse(localStorage.getItem('invoiceData'));
	}
}

