// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { SocialsService } from '../../../../../core/socials';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { Location } from '@angular/common';

// url

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-social-edit',
	templateUrl: './social-edit.component.html',
	styleUrls: ['./social-edit.component.scss']
})
export class SocialEditComponent implements OnInit, OnDestroy {
	social;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	socialForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	idParams: string;
	ssocial = 'facebook';
	BASE_URL = environment.BASE_URL;
	appID = '';
	customerKey = '';
	customerSecret = '';
	callbackUrl = '';
	appURL = '';
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private _location: Location,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private socialsService: SocialsService
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.appURL = window.location.href;
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		this.loadingSubject.next(false);
	}

	goBack() {
		this._location.back();
	}

	getSocialDetails() {
		return this.socialsService.getLinkById(this.idParams).pipe(
			map(socialDetails => {
				this.social = socialDetails;
				this.loadingSubject.next(false);
				console.log('retrieving social with pipe', this.social);
				return this.social;
			})
		);
	}

	passSocial(event) {
		this.ssocial = event.target.value;
	}

	getComponentTitle() {
		let result = 'Please Wait';
		if (!this.social || !this.social.code) {
			result = 'Add Social Media Campaign';
			return result;
		}
		result = `Edit Social Media Campaign`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		this.loadingSubject.next(true);
		/** check form */
		if (this.social) {
			this.updateSocial();
			return;
		}
		this.addSocial();
	}


	addSocial() {
		this.loadingSubject.next(true);
		let payload;
		if (this.ssocial === 'facebook') {
			if (this.appID === '') {
				const message = 'appID is compulsory';
				return this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			}
			localStorage.setItem('fbkID', this.appID);
			payload = {
				type: 'facebook',
				data: {
					app_id: this.appID
				}
			};
		} else {
			if (this.customerKey === '' || this.customerSecret === '' || this.callbackUrl === '') {
				const message = 'All fields are compulsory';
				return this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			}
			payload = {
				type: 'twitter',
				data: {
					consumerKey: this.customerKey,
					consumerSecret: this.customerSecret,
					callbackUrl: this.callbackUrl
				}
			};
		}
		this.socialsService.addSocial(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `Social account has been Successfully added`;
				localStorage.setItem('registeredTwitter', 'true');
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/cdash/socials/socials']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	updateSocial() {
		let payload;
		if (this.ssocial === 'facebook') {
			payload = {
				type: 'facebook',
				data: {
					app_id: this.appID
				}
			};
		} else {
			payload = {
				type: 'twitter',
				data: {
					consumerKey: this.customerKey,
					consumerSecret: this.customerSecret,
					callbackUrl: this.BASE_URL
				}
			};
		}
		this.socialsService.updateLink(payload, this.social.code).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Updated Successfully`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/socials/socials']);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}


	reset() {
		this.appID = '';
		this.customerKey = '';
		this.customerSecret = '';
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
