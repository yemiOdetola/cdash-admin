// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { AssetModel, AssetsService } from '../../../../../core/assets';
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
	selector: 'kt-asset-edit',
	templateUrl: './asset-edit.component.html',
	styleUrls: ['./asset-edit.component.scss'],
	providers: [
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
	],
})
export class AssetEditComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	hasFormErrors: boolean = false;
	headerMargin: number;
	idParams: string;
	form = [];
	addedIcon = false;
	constructor(

		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private assetsService: AssetsService
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.loadingSubject.next(true);
		} else {
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
	}

	getComponentTitle() {
		return 'Asset form container';
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	addIcon() {
		this.addedIcon = !this.addedIcon;
		const funcForm = this.form;
		if (funcForm.length) {
			for (let i = 0; i < funcForm.length; i++) {
				if (funcForm[i].id === 'icon') {
					funcForm.splice(i, 1);
					this.form = funcForm;
					console.log(this.form);
				} else {
					const obj = {
						id: 'icon',
						type: 'file',
						required: true,
					};
					this.form.push(obj);
					console.log(this.form);
				}
			}
		} else {
			const obj = {
				id: 'icon',
				type: 'file',
				required: true,
			};
			this.form.push(obj);
			console.log(this.form);
		}
	}

	addSummary() {
		this.addedIcon = !this.addedIcon;
		const funcForm = this.form;
		if (funcForm.length) {
			for (let i = 0; i < funcForm.length; i++) {
				if (funcForm[i].id === 'summary') {
					funcForm.splice(i, 1);
					this.form = funcForm;
					console.log(this.form);
				} else {
					const obj = {
						id: 'summary',
						type: 'text',
						required: true,
					};
					this.form.push(obj);
					console.log(this.form);
				}
			}
		} else {
			const obj = {
				id: 'summary',
				type: 'text',
				required: true,
			};
			this.form.push(obj);
			console.log(this.form);
		}
	}

	addFormElement(type, id) {
		const funcForm = this.form;
		if (funcForm.length) {
			for (let i = 0; i < funcForm.length; i++) {
				if (this.form[i].id === id) {
					this.form.splice(i, 1);
					console.log(this.form);
				} else {
					this.form.push({
						id: id,
						type: type,
						required: true,
					});
					console.log(this.form);
				}
			}
		} else {
			const obj = {
				id: id,
				type: type,
				required: true,
			};
			this.form.push(obj);
			console.log(this.form);
		}
	}








	ngOnDestroy() { }

}
