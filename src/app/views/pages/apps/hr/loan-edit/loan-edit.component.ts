// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { ClaimModel, ClaimsService } from '../../../../../core/claims';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';

// imprts for date hiccup
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports

const moment = _moment;

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-loan-edit',
	templateUrl: './loan-edit.component.html',
	styleUrls: ['./loan-edit.component.scss'],
	providers: [
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
	],
})
export class LoanEditComponent implements OnInit, OnDestroy {
	loan: ClaimModel;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldLoan: ClaimModel;
	loanForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	idParams: string;
	// typeNames = ['claim', 'leave', 'loan'];
	types = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private claimsService: ClaimsService
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.emptyLoanForm();
		this.getRequestTypes();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getLoanDetails().subscribe(loanData => this.initLoanForm(loanData));
			this.loadingSubject.next(true);
		} else {
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		this.loadingSubject.next(false);
	}

	getRequestTypes() {
		this.loadingSubject.next(true);
		return this.claimsService.getClaimTypes().subscribe(
			response => {
				this.types = response['success'];
				this.loadingSubject.next(false);
			},
			error => {
				this.loadingSubject.next(true);
				console.log('error getting types', error);
			}
		);
	}

	getLoanDetails() {
		return this.claimsService.getClaimById(this.idParams).pipe(
			map(loanDetails => {
				this.loan = loanDetails['success'];
				this.loadingSubject.next(false);
				console.log('retrieving loans with pipe', this.loan);
				return this.loan;
			})
		);
	}

	emptyLoanForm() {
		this.loanForm = this.fb.group({
			name: ['', Validators.required],
			start: ['', Validators.required],
			end: ['', Validators.required],
			amount: ['', Validators.required],
			description: ['', Validators.required],
			claim_type_id: ['', Validators.required]
		});
	}

	initLoanForm(loan: any = {}) {
		let startDate = moment(loan.start).format('YYYY-MM-DD');
		let endDate = moment(loan.end).format('YYYY-MM-DD');
		this.loanForm = this.fb.group({
			name: [loan.name || '', Validators.required],
			start: [startDate || '', Validators.required],
			end: [endDate || '', Validators.required],
			amount: [loan.amount || '', Validators.required],
			description: ['', Validators.required],
			claim_type_id: ['', Validators.required]
		});
	}
	getComponentTitle() {
		let result = 'Request A Loan';
		if (!this.loan || !this.loan._id) {
			return result;
		}
		result = `Edit Loan -  ${this.loan.name}`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.loanForm.controls;
		this.loadingSubject.next(true);
		console.log(this.loanForm.value);
		/** check form */
		if (this.loanForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.loan && this.loan._id) {
			console.log('lead has an Id');
			let editedLoan = this.loanForm.value;
			console.log('Loan to send', editedLoan);
			this.updateLoan(editedLoan);
			return;
		}
		this.addLoan(this.loanForm.value);
	}

	updateLoan(loan) {
		const convertedStart = moment(loan.start).valueOf();
		const convertedEnd = moment(loan.end).valueOf();
		const remixedPayload = {
			name: loan.name,
			type: 'loan',
			start: convertedStart,
			end: convertedEnd,
			amount: loan.amount,
			description: loan.description,
			claim_type_id: loan.claim_type_id
		};
		console.log('update request', remixedPayload);
		this.claimsService.updateRequest(remixedPayload, this.loan._id).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `New Loan has been Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/hr/loans']);
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
	addLoan(_loan: ClaimModel) {
		let prepStart = new Date(_loan.start);
		let prepEnd = new Date(_loan.end);
		const convertedStart = prepStart.getTime();
		const convertedEnd = prepEnd.getTime();
		const remixedPayload = {
			name: _loan.name,
			type: 'loan',
			start: convertedStart,
			end: convertedEnd,
			amount: _loan.amount,
			description: _loan.description,
			claim_type_id: _loan.claim_type_id
		};
		console.log('remixedPayload', remixedPayload);
		this.loadingSubject.next(true);
		this.claimsService.createLoan(remixedPayload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `New Loan has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/hr/loans']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	reset() {
		this.loan = Object.assign({}, this.oldLoan);
		this.emptyLoanForm();
		this.hasFormErrors = false;
		this.loanForm.markAsPristine();
		this.loanForm.markAsUntouched();
		this.loanForm.updateValueAndValidity();
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
