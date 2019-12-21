// Angular
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { ProjectsService } from '../../../../../core/projects';
import { VendorsService } from '../../../../../core/vendors';

@Component({
	selector: 'kt-purchase-order',
	templateUrl: './purchase-order.component.html',
	styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	poform: FormGroup;
	goodForm: FormGroup;
	goods = [];
	projects = [];
	selectedGood;
	displayGoodsArray = [];
	addGoodForm: FormGroup;
	payloadGoods = [];
	payloadPrices = [];
	payloadUnits = [];
	showAmountQuantity = false;
	constructor(
		private dialogRef: MatDialogRef<PurchaseOrderComponent>,
		private fb: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private projectsService: ProjectsService,
		private vendorsService: VendorsService,
		@Inject(MAT_DIALOG_DATA) data) { }

	ngOnInit() {
		let parentVendorGoods = localStorage.getItem('vendorGoods');
		this.goods = parentVendorGoods.split(',');
		this.initPurchaseOrderForm();
		this.initGoodForm();
		this.initAddGoodForm();
		this.getProjects();
	}

	initPurchaseOrderForm() {
		this.poform = this.fb.group({
			project_id: ['', Validators.required],
			subject: ['', Validators.required],
			body: ['', Validators.required],
			shipping: ['', Validators.required],
		});
	}

	initGoodForm() {
		this.goodForm = this.fb.group({
			quantity: ['', Validators.required],
			amount: ['', Validators.required],
			// price: ['', Validators.required]
		});
	}

	initAddGoodForm() {
		this.addGoodForm = this.fb.group({
			good: ['', Validators.required]
		});
	}

	addSelectedGood() {
		this.selectedGood = this.addGoodForm.value.good;
		console.log('selected Good', this.selectedGood);
		for (let x = 0; x < this.displayGoodsArray.length; x++) {
			if (this.displayGoodsArray[x] === this.selectedGood) {
				return;
			}
		}
		this.showAmountQuantity = true;
		this.displayGoodsArray.push(this.selectedGood);
		console.log(this.displayGoodsArray, this.displayGoodsArray);
	}

	removeGood(id) {
		this.displayGoodsArray.splice(id, 1);
		this.payloadGoods.splice(id, 1);
		this.payloadPrices.splice(id, 1);
		this.payloadUnits.splice(id, 1);
		console.log('in order removed', this.payloadGoods,this.payloadPrices, this.payloadUnits);
	}

	pushGoodValues() {
		this.payloadGoods.push(this.selectedGood);
		this.payloadPrices.push(this.goodForm.value.amount);
		this.payloadUnits.push(this.goodForm.value.quantity);
		console.log('in order', this.payloadGoods,this.payloadPrices, this.payloadUnits);
		console.log('this.displayGoodsArray', this.displayGoodsArray);
		this.showAmountQuantity = false;
	}

	getProjects() {
		this.loadingSubject.next(true);
		this.projectsService.getProjectsEvery().subscribe(
			responseData => {
				this.projects = responseData['success'];
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			}
		);
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	sendPO() {
		this.loadingSubject.next(true);
		const vendorId = localStorage.getItem('vendorId');
		const vendorEmail = localStorage.getItem('vendorEmail');
		const projectId = this.poform.value.project_id;
		const payload = {
			subject: this.poform.value.subject,
			body: this.poform.value.body,
			shipping: this.poform.value.shipping,
			email: vendorEmail,
			goods: this.payloadGoods,
			prices: this.payloadPrices,
			units: this.payloadUnits
		};
		this.vendorsService.sendPO(payload, projectId, vendorId).subscribe(
			data => {
				if (data['error']) {
					const msg = `Please Retry... Temporary Error`;
					this.layoutUtilsService.showActionNotification(msg, MessageType.Create, 10000, true, true);
					this.dialogRef.close();
				} else {
					console.log('success reponse', data);
					this.loadingSubject.next(false);
					const message = `PO has been sent successfully`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
					this.dialogRef.close();
				}
				this.dialogRef.close();
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				// this.dialogRef.close();
			});
		this.dialogRef.close();
	}

	close() {
		this.dialogRef.close();
	}

	getTitle(): string {
		return 'Purchase Order';
	}
}
