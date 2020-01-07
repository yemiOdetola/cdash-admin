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
	constructor(
		private authService: AuthService,
		private socialsService: SocialsService,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router, ) { }

	ngOnInit() {
		this.getSocialSetup();
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.fbkDetails = JSON.parse(localStorage.getItem('facebookDetails'));
		this.authService.authState.subscribe((user) => {
			this.user = user;
			console.log('logged in user', user);
		});
		this.getAllSocials();
		this.loadingSubject.next(false);
		const urrl = window.location.href;
		this.validURL = `http://142.93.6.250/v1/social/twitter?url=${urrl}`;
	}

	getSocialSetup() {
		this.loadingSubject.next(true);
		this.socialsService.getSocialSetup().subscribe(
			socialss => {
				this.loadingSubject.next(false);
				this.setupSocials = socialss['data'];
				this.setupSocials.forEach(social => {
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

	signInWithFB(): void {
		this.setupSocials.forEach(social => {
			if (social.type === 'facebook') {
				const fbkID = social.data.app_id;
				FacebookLoginProvider.PROVIDER_ID = fbkID;
				this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(response => {
					this.layoutUtilsService.showActionNotification('Facebook signin successful', MessageType.Create, 10000, true, true);
					localStorage.setItem('facebookDetails', JSON.stringify(response));
					this.fbkDetails = JSON.parse(localStorage.getItem('facebookDetails'));
					this.addSocial(this.fbkDetails.name, this.fbkDetails.email, localStorage.getItem('fbkID'));
				});
			} else {
				const message = `Please wait...`;
				return this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			}
		});
	}

	initTwitterr() {
		this.setupSocials.forEach(social => {
			if (social.type === 'twitter') {
				let url = window.location.href;
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
				const message = `Please wait...`;
				return this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			}
		});
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
