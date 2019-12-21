// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { SocialModel, SocialsService } from '../../../../../core/socials';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-social-edit',
	templateUrl: './social-edit.component.html',
	styleUrls: ['./social-edit.component.scss']
})
export class SocialEditComponent implements OnInit, OnDestroy {
	social: SocialModel;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldCSocial: SocialModel;
	socialForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	selectedFile: File = null;
	idParams: string;
	fSelected;
	fileName = '';
	urlRegex = `(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?`;
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private socialsService: SocialsService
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.initSocialForm();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getSocialDetails().subscribe(socialData => this.initSocialForm(socialData));
			this.loadingSubject.next(true);
		} else {
			this.social = this.socialForm.value;
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.socialForm.value);
		console.log('form control', this.socialForm.controls);
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

	initSocialForm(social: any = {}) {
		this.socialForm = this.fb.group({
			link: [social.link || '', Validators.required],
			title: [social.title || '', Validators.required],
			target: [social.target || '', Validators.required],
			file: ['']
		});
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
		const controls = this.socialForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.socialForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.social && this.social.code) {
			console.log('Social has an Id');
			let editedSocial = this.socialForm.value;
			console.log('Social to send', editedSocial);
			this.updateSocial(editedSocial);
			return;
		}
		this.addSocial(this.socialForm.value);
	}

	updateSocial(social) {
		let updPayload = new FormData();
		updPayload.append('link', this.socialForm.get('link').value);
		updPayload.append('title', this.socialForm.get('title').value);
		updPayload.append('target', this.socialForm.get('target').value);
		updPayload.append('file', this.fSelected, this.fSelected.name);
		this.socialsService.updateLink(updPayload, this.social.code).subscribe(
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
	/**
	 * Add Social
	 *
	 * @param _social: SocialModel
	 * @param withBack: boolean
	 */
	addSocial(_social: SocialModel) {
		this.loadingSubject.next(true);
		let updPayload = new FormData();
		updPayload.append('link', this.socialForm.get('link').value);
		updPayload.append('title', this.socialForm.get('title').value);
		updPayload.append('target', this.socialForm.get('target').value);
		updPayload.append('file', this.fSelected, this.fSelected.name);
		this.socialsService.createLink(updPayload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `Social has been Successfully Created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/socials/socials']);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	onFileChange(event) {
		if (event.target.files.length > 0) {
			const fileSelected: File = event.target.files[0];
			this.fSelected = fileSelected;
			this.fileName = fileSelected.name;
			console.log('fileSelected', fileSelected['originFileObj']);
		}
	}

	reset() {
		this.social = Object.assign({}, this.oldCSocial);
		this.initSocialForm();
		this.hasFormErrors = false;
		this.socialForm.markAsPristine();
		this.socialForm.markAsUntouched();
		this.socialForm.updateValueAndValidity();
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
