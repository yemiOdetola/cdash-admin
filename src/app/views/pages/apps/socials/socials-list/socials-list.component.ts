// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { AuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { FacebookLoginProvider } from 'angularx-social-login';
import { SocialsService } from '../../../../../core/socials';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Router } from '@angular/router';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-socials-list',
	templateUrl: './socials-list.component.html',
	styleUrls: ['./socials-list.component.scss']
})
export class SocialsListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	user: SocialUser;
	showTwitterForm = false;
	token = '';
	redURL = window.location.href;
	socialls;
	fbkDetails;
	setupSocials;
	validTwitter = false;
	validURL = '';
	linkedInUrl = '';
	linkedInCode = '';
	windowsUrl = '';
	instaUsername = '';
	birdAvailable = false;
	fbkAvailable = false;
	gramAvailable = false;
	inAvailable = false;
	constructor(
		private authService: AuthService,
		private socialsService: SocialsService,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router, ) { }

	ngOnInit() {
		this.getSocialSetup();
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		if (localStorage.getItem('facebookDetails')) {
			this.fbkDetails = JSON.parse(localStorage.getItem('facebookDetails'));
		}
		this.authService.authState.subscribe((user) => {
			this.user = user;
		});
		this.getAllSocials();
		this.loadingSubject.next(false);
		const urrl = window.location.href;
		this.windowsUrl = urrl;
		this.validURL = `http://142.93.6.250/v1/social/twitter?url=${urrl}`;
	}

	getSocialSetup() {
		this.loadingSubject.next(true);
		this.socialsService.getSocialSetup().subscribe(
			socialss => {
				this.loadingSubject.next(false);
				this.setupSocials = socialss['data'];
				this.setupSocials.forEach(social => {
					if (social.type === 'facebook') { this.fbkAvailable = true; }
					if (social.type === 'instagram') { this.gramAvailable = true; }
					if (social.type === 'linkedin') { this.inAvailable = true; }
					if (social.type === 'twitter') { this.birdAvailable = true; }


					if (social.type === 'facebook') {
						localStorage.setItem('fbkID', social.data.app_id);
					}
					if (social.type === 'twitter') {
						this.validTwitter = true;
					}
				});
			}
		);
	}

	signInWithFB() {
		if (this.setupSocials) {
			if (!this.fbkAvailable) {
				const message = `Facebook account is not configured`;
				return this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			}
			this.setupSocials.forEach(social => {
				if (social && social.type === 'facebook') {
					console.log('socials setup valid');
					const fbkID = social.data.app_id;
					FacebookLoginProvider.PROVIDER_ID = fbkID;
					this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(response => {
						this.layoutUtilsService.showActionNotification('Facebook signin successful', MessageType.Create, 10000, true, true);
						localStorage.setItem('facebookDetails', JSON.stringify(response));
						if (localStorage.getItem('facebookDetails')) {
							this.fbkDetails = JSON.parse(localStorage.getItem('facebookDetails'));
						}
						this.addSocial(this.fbkDetails.name, this.fbkDetails.email, localStorage.getItem('fbkID'));
					});
				} else {
					const message = `Facebook account is not configured`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				}
			});
		} else {
			const message = `Configuration not available. `;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 4000, true, true);
		}
	}

	initTwitterr() {
		if (this.setupSocials) {
			if (!this.birdAvailable) {
				const message = `Twitter account is not configured`;
				return this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			}
			this.setupSocials.forEach(social => {
				if (social && social.type === 'twitter') {
					console.log('acceoted inner 1');
					let url = window.location.href;
					window.open(this.validURL, '_blank');
					console.log('callback url', url);
					this.socialsService.getSocial(url).subscribe(
						data => {
							this.loadingSubject.next(false);
							console.log('success reponse', data);
							const message = `Success`;
							localStorage.setItem('registeredTwitter', 'true');
							this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
						}, error => {
							this.loadingSubject.next(false);
							console.log('Error response', error);
							const title = 'Please Retry';
							const message = 'Sorry, Temporary Error Occured';
							this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
						});
				} else {
					console.log('inner invalid');
					const message = `Twitter account is not configured`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				}
			});
		} else {
			console.log('returned false here general');
			const message = `Configuration not available. `;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 4000, true, true);
		}
	}

	initLinkedIn() {
		if (this.setupSocials) {
			if (!this.inAvailable) {
				const message = `LinkedIn account is not configured`;
				return this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			}
			this.setupSocials.forEach(social => {
				if (social.type === 'linkedin') {
					let url = window.location.href;
					this.linkedInCode = 'lol';
					this.linkedInUrl = `http://142.93.6.250/v1/social/linkedin?url=${url}`;
					window.open(this.linkedInUrl, '_blank');
					this.socialsService.getSocialLinkedin(url, this.linkedInCode).subscribe(
						data => {
							this.loadingSubject.next(false);
							console.log('success reponse', data);
							const message = `Success`;
							this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
						}, error => {
							this.loadingSubject.next(false);
							console.log('Error response', error);
							const title = 'Please Retry';
							const message = 'Sorry, Temporary Error Occured';
							this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
						});
				} else {
					console.log('linkedin inexistence');
					const message = `LinkedIn social network is not configured`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				}
			});
		} else {
			const message = `Configuration not available. `;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 4000, true, true);
		}
	}

	initInstagram() {
		if (this.setupSocials) {
			if (!this.fbkAvailable) {
				const message = `Instagram account is not configured`;
				return this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			}
			this.setupSocials.forEach(social => {
				if (social.type === 'instagram') {
					let url = window.location.href;
					this.linkedInCode = 'lol';
					this.linkedInUrl = `http://142.93.6.250/v1/social/linkedin?url=${url}`;
					window.open(this.linkedInUrl, '_blank');
					let payload = {
						username: this.instaUsername
					};
					this.socialsService.getSocialInstagram(payload).subscribe(
						data => {
							this.loadingSubject.next(false);
							console.log('success reponse', data);
							const message = `Success`;
							this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
						}, error => {
							this.loadingSubject.next(false);
							console.log('Error response', error);
							const title = 'Please Retry';
							const message = 'Sorry, Temporary Error Occured';
							this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
						});
				} else {
					const message = `Instagram social network is not configured`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				}
			});
		} else {
			const message = `Configuration not available. `;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 4000, true, true);
		}
	}


	addSocial(name, email, app_id) {
		this.loadingSubject.next(true);
		let payload = {
			type: 'facebook',
			data: {
				name: name,
				email: email,
				lol: app_id
			}
		};
		this.socialsService.addNewSocial(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `Success`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 3000, true, true);
				this.getAllSocials();
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 4000, true, true);
			});
	}

	getAllSocials() {
		this.loadingSubject.next(true);
		this.socialsService.getAllSocials().subscribe(
			socialss => {
				console.log('sosocialls', socialss);
				this.loadingSubject.next(false);
				this.socialls = socialss['data'];
			}
		);
	}

	toggleTwitter() {
		this.showTwitterForm = !this.showTwitterForm;
	}

	ngOnDestroy() { }
}
