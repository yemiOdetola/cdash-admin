import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorModel, VendorsService } from '../../../../../core/vendors';
import { ProjectsService } from '../../../../../core/projects';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
	selector: 'kt-vendor',
	templateUrl: './vendor.component.html',
	styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	vendorId: string;
	vendorDetails: any;
	addGoodForm: FormGroup;
	goodForm: FormGroup;
	poform: FormGroup;
	pageTitle = 'Please wait...';
	activeTab = 'po';
	goods = [];
	displayGoodsArray = [];
	good;
	quantity;
	POgoods = [];
	selectedGood = '';
	payloadGoods = [];
	payloadPrices = [];
	poList: [];
	projects: any;
	payloadUnits = [];
	showAmountQuantity = false;
	constructor(
		private route: ActivatedRoute,
		private vendorsService: VendorsService,
		private _location: Location,
		private projectsService: ProjectsService,
		private fb: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.vendorId = this.route.snapshot.params['id'];
		let parentVendorGoods = localStorage.getItem('vendorGoods');
		this.initPurchaseOrderForm();
		this.initGoodForm();
		this.initAddGoodForm();
		this.getProjects();
		this.vendorsService.getVendorById(this.vendorId).subscribe(
			singleVendor => {
				this.vendorDetails = singleVendor['success'];
				localStorage.setItem('vendorId', this.vendorDetails._id);
				localStorage.setItem('vendorEmail', this.vendorDetails.email);
				localStorage.setItem('vendorGoods', this.vendorDetails.goods);
				this.goods = this.vendorDetails.goods;
				this.loadingSubject.next(false);
				this.pageTitle = `${this.vendorDetails.name} - ${this.vendorDetails.industry}`;
				this.POgoods = this.vendorDetails.goods;
			},
			error => {
				this.loadingSubject.next(false);
			}
		);
		if (this.goods) {
			this.goods = parentVendorGoods.split(',');
		}
		console.log('id returned', this.route.snapshot.params['id']);
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
		});
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
				} else {
					console.log('success reponse', data);
					this.loadingSubject.next(false);
					const message = `PO has been sent successfully`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				}
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				// this.dialogRef.close();
			});
	}

	addNewGood() {
		let goodsObj: any = {};
		console.log('pushed', this.good);
		if (this.good === '' || this.quantity < 1) {
			return;
		}
		let goood = this.good;
		console.log('goood', goood);
		goodsObj[goood] = this.quantity;
		console.log('goodsObj', goodsObj);
		let totalGoods = { ...goodsObj };
		this.goods.push(totalGoods);
		let vendorGoods: any = this.goods;
		localStorage.setItem('vendorGoods', vendorGoods);
		this.good = '';
		this.quantity = 1;
		console.log('goods', this.goods);
	}

	initAddGoodForm() {
		this.addGoodForm = this.fb.group({
			good: ['', Validators.required]
		});
	}

	getPurchaseOrders(vendorId) {
		this.vendorsService.getPOs(vendorId).subscribe(
			salesPO => {
				this.poList = salesPO['success'];
				console.log('PO list PO list', salesPO);
				this.loadingSubject.next(false);
			},
			error => {
				const message = 'Sorry, Could not retrieve Purchase Orders';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
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

	pushGoodValues() {
		this.payloadGoods.push(this.selectedGood);
		this.payloadPrices.push(this.goodForm.value.amount);
		this.payloadUnits.push(this.goodForm.value.quantity);
		this.showAmountQuantity = false;
	}

	addVendorGood() {
		this.loadingSubject.next(true);
		if (this.good === '') {
			return;
		}
		this.goods.push(this.good);
		const goods = this.goods;
		this.vendorsService.updateVendor({ goods }, this.vendorId).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
			},
			error => {
				this.loadingSubject.next(true);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Good is not Added to Vendor. Retry';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
		this.good = '';
		let vendorGoods: any = this.goods;
		localStorage.setItem('vendorGoods', vendorGoods);
	}

	activateTab(tab) {
		return this.activeTab = tab;
	}

	removeGood(id) {
		this.goods.splice(id, 1);
		console.log(id);
	}

	removePayGood(id) {
		this.displayGoodsArray.splice(id, 1);
		this.payloadGoods.splice(id, 1);
		this.payloadPrices.splice(id, 1);
		this.payloadUnits.splice(id, 1);
	}

	goBack() {
		this._location.back();
	}

	onDelete() {
		const _title: string = 'Delete Vendor';
		const _description: string = 'Are you sure to permanently delete this Vendor?';
		const _waitDesciption: string = 'Deleting Vendor';
		const _deleteMessage = `Vendor has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.vendorsService.deleteVendor(this.vendorId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/strada/vendors/vendors']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}
}
