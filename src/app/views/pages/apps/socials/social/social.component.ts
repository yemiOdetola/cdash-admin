import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialModel, SocialsService } from '../../../../../core/socials';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import * as CanvasJS from '../../../../../../assets/chart-canvas/canvasjs.min';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-social',
	templateUrl: './social.component.html',
	styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	socialId: string;
	socialDetails: any;
	pageTitle = 'Please wait...';
	facebookLink = '';
	twitterLink = '';
	linkedInLink = '';
	socials = ['facebook', 'twitter', 'instagram', 'linkedin'];
	facebookAnalytics = 0;
	twitterAnalytics = 0;
	linkedinAnalytics = 0;
	allSocialAnalytics = 0;
	analyticA;
	totalTarget = 0;
	chart;
	chart2;
	constructor(
		private route: ActivatedRoute,
		private socialsService: SocialsService,
		private _location: Location,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.socialId = this.route.snapshot.params['id'];
		this.socialsService.getLinkById(this.socialId).subscribe(
			singleLink => {
				this.socialDetails = singleLink;
				this.facebookLink = `${singleLink.link}?type='facebook'`;
				this.twitterLink = `${singleLink.link}?type='twitter'`;
				this.linkedInLink = `${singleLink.link}?type='linkedin'`;
				this.pageTitle = `Social Campaign Details`;
				this.totalTarget = singleLink.target;
			},
			error => {
				console.log('error occured', error);
			}
		);
		this.getAllAnalytics();
		this.getSingleSocial('facebook');
		this.getSingleSocial('twitter');
		this.getSingleSocial('linkedin');
		console.log('id returned', this.route.snapshot.params['id']);
		this.loadingSubject.next(false);
		// this.chart2.render();
	}

	goBack() {
		this._location.back();
	}

	initBarchart() {
		return this.chart = new CanvasJS.Chart('chartContainer', {
			animationEnabled: true,
			theme: 'light1',
			exportEnabled: true,
			title: {
				text: ''
			},
			data: [{
				type: 'column',
				color: 'pink',
				dataPoints: [
					{ y: this.allSocialAnalytics, label: 'Current' },
					{ y: this.totalTarget, label: 'Target' }
				]
			}]
		});
	}

	initPieChart() {
		return this.chart2 = new CanvasJS.Chart('chartContainer2', {
			theme: 'light2',
			animationEnabled: true,
			exportEnabled: true,
			title: {
				text: ''
			},
			data: [{
				type: 'pie',
				showInLegend: true,
				color: 'dimGray',
				toolTipContent: '<b>{name}</b>: {y} (#percent%)',
				indexLabel: '{name} - #percent%',
				dataPoints: [
					{ y: this.facebookAnalytics, name: 'Facebook' },
					{ y: this.twitterAnalytics, name: 'Twitter' },
					{ y: this.linkedinAnalytics, name: 'LinkedIn' }
				]
			}]
		});
	}

	getSingleSocial(socialType) {
		this.loadingSubject.next(true);
		this.socialsService.getEachSocialAnalytics(this.socialId, socialType).subscribe(
			analytics => {
				setTimeout(() => {
					if (socialType === 'facebook') {
						if (analytics) {
							this.facebookAnalytics = analytics[0].total;
						}
					} else if (socialType === 'twitter') {
						if (analytics) {
							this.twitterAnalytics = analytics[0].total;
						}
					} else if (socialType === 'linkedin') {
						if (analytics) {
							this.linkedinAnalytics = analytics[0].total;
						}
					}
					this.initPieChart();
					this.chart2.render();
					this.loadingSubject.next(false);
				}, 200);
			},
			error => {
				console.log('error occured', error);
			}
		);
	}

	getAllAnalytics() {
		this.loadingSubject.next(true);
		this.socialsService.getAllSocialAnalytics(this.socialId).subscribe(
			analytics => {
				console.log('analytics', analytics);
				this.allSocialAnalytics = analytics[0].total;
				this.initBarchart();
				this.chart.render();
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error occured', error);
			}
		);
	}

	// hlksdds sdds sdklds l;sdl;sd l;sdldsklsd

	onDelete() {
		const _title: string = 'Delete social';
		const _description: string = 'Are you sure to permanently delete this social?';
		const _waitDesciption: string = 'Deleting social';
		const _deleteMessage = `social has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.socialsService.deleteLink(this.socialId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/strada/socials/socials']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}
}
