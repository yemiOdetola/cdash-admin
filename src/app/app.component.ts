import { Subscription } from 'rxjs';
// Angular
import { Component, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// Layout
import { LayoutConfigService, SplashScreenService } from './core/_base/layout';
// Layout
import { TranslationService } from './core/_base/layout';
// Push notification
import { MessagingService } from './core/push-notification/messaging.service';

import { select, Store } from '@ngrx/store';
import { currentUser, User } from './core/auth';
import { AppState } from './core/reducers';
import { Observable } from 'rxjs';
// language list
import { locale as enLang } from './core/_config/i18n/en';
import { locale as chLang } from './core/_config/i18n/ch';
import { locale as esLang } from './core/_config/i18n/es';
import { locale as jpLang } from './core/_config/i18n/jp';
import { locale as deLang } from './core/_config/i18n/de';
import { locale as frLang } from './core/_config/i18n/fr';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'body[kt-root]',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
	// Public properties
	title = 'STRADA';
	loader: boolean;
	message;
	userId = '';
	user$: Observable<User>;
	private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param translationService: TranslationService
	 * @param router: Router
	 * @param layoutConfigService: LayoutCongifService
	 * @param splashScreenService: SplashScreenService
	 */
	constructor(private translationService: TranslationService,
		private router: Router,
		private layoutConfigService: LayoutConfigService,
		private splashScreenService: SplashScreenService,
		private messagingService: MessagingService,
		private store: Store<AppState>,
	) {

		// register translations
		this.translationService.loadTranslations(enLang, chLang, esLang, jpLang, deLang, frLang);
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		// enable/disable loader
		this.loader = this.layoutConfigService.getConfig('loader.enabled');

		const routerSubscription = this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				// hide splash screen
				this.splashScreenService.hide();
				// scroll to top on every route change
				window.scrollTo(0, 0);
			}
		});
		this.unsubscribe.push(routerSubscription);
		// firePushNotification
	}

	ngAfterViewInit() {
		this.user$ = this.store.pipe(select(currentUser));
		this.user$.subscribe(
			userData => {
				this.userId = userData['_id'];});
	}


	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.unsubscribe.forEach(sb => sb.unsubscribe());
	}
}
