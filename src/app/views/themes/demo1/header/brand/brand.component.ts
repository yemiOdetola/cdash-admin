// Angular
import { AfterViewInit, Component, OnInit } from '@angular/core';
// Layout
import { LayoutConfigService, ToggleOptions } from '../../../../../core/_base/layout';
import { HtmlClassService } from '../../html-class.service';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-brand',
	templateUrl: './brand.component.html',
	styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit, AfterViewInit {
	// Public properties
	headerLogo: string;
	setBackground = '';
	headerStickyLogo: string;
	brandIcon = './assets/media/logos/logo.png';
	orgDetails;
	toggleOptions: ToggleOptions = {
		target: 'body',
		targetState: 'kt-aside--minimize',
		togglerState: 'kt-aside__brand-aside-toggler--active'
	};

	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayoutConfigService
	 * @param htmlClassService: HtmlClassService
	 */
	constructor(private layoutConfigService: LayoutConfigService,private location: Location, public htmlClassService: HtmlClassService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		setTimeout(() => {
			this.orgDetails = JSON.parse(localStorage.getItem('siteMeta'));
			if (!JSON.parse(localStorage.getItem('siteMeta'))) {
				localStorage.setItem('logo', this.brandIcon);
			} else {
				this.brandIcon = this.orgDetails.logo;
			}
			if (!JSON.parse(localStorage.getItem('siteMeta'))) {
				localStorage.setItem('orgBg', '#1e1e2d');
			} else {
				this.setBackground = this.orgDetails.color;
			}
			this.headerLogo = this.layoutConfigService.getLogo();
			this.headerStickyLogo = this.layoutConfigService.getStickyLogo();
		}, 20);
	}

	/**
	 * On destroy
	 */
	ngAfterViewInit(): void {
	}
}
