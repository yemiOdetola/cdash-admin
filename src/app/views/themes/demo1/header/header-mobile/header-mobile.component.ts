// Angular
import { Component, OnInit } from '@angular/core';
// Layout
import { LayoutConfigService, ToggleOptions } from '../../../../../core/_base/layout';

@Component({
	selector: 'kt-header-mobile',
	templateUrl: './header-mobile.component.html',
	styleUrls: ['./header-mobile.component.scss']
})
export class HeaderMobileComponent implements OnInit {
	// Public properties
	headerLogo: string;
	setBackground = '';
	brandIcon = './assets/media/logos/logo.png';
	asideDisplay: boolean;

	toggleOptions: ToggleOptions = {
		target: 'body',
		targetState: 'kt-header__topbar--mobile-on',
		togglerState: 'kt-header-mobile__toolbar-topbar-toggler--active'
	};

	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private layoutConfigService: LayoutConfigService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		if (!localStorage.getItem('orgLogo')) {
			localStorage.setItem('orgLogo', this.brandIcon);
			window.location.reload();
		} else {
			this.brandIcon = localStorage.getItem('orgLogo');
		}
		if (!localStorage.getItem('orgBg')) {
			localStorage.setItem('orgBg', '#1e1e2d');
		} else {
			this.setBackground = localStorage.getItem('orgBg');
		}
		this.headerLogo = this.layoutConfigService.getLogo();
		this.asideDisplay = this.layoutConfigService.getConfig('aside.self.display');
	}
}
