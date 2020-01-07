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
	constructor(
		private authService: AuthService,
		private socialsService: SocialsService,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router,) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.fbkDetails = JSON.parse(localStorage.getItem('facebookDetails'));
		this.authService.authState.subscribe((user) => {
			this.user = user;
			console.log('logged in user', user);
		});
		this.getAllSocials();
		this.loadingSubject.next(false);
	}

	signInWithFB(): void {
		const fbkID = localStorage.getItem('fbkID');
		if (!localStorage.getItem('fbkID')) {
			return alert('Add facebook credentials before signing in');
		}
		FacebookLoginProvider.PROVIDER_ID = fbkID;
		this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(response => {
			this.layoutUtilsService.showActionNotification('Facebook signin successful', MessageType.Create, 10000, true, true);
			localStorage.setItem('facebookDetails', JSON.stringify(response));
			this.fbkDetails = JSON.parse(localStorage.getItem('facebookDetails'));
		});
	}

	initTwitterr() {
		if (!localStorage.getItem('registeredTwitter')) {
			return alert('Add twitter credentials before signing in');
		}
		let url = window.location.href;
		this.socialsService.getSocial(url).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `Social account has been Successfully added`;
				localStorage.setItem('registeredTwitter', 'true');
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			}, error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
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
