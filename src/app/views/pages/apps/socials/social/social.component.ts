import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialsService } from '../../../../../core/socials';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
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
	constructor(
		private route: ActivatedRoute,
		private socialsService: SocialsService,
		private _location: Location,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		console.log('uuuuurrrrrrlllll', window.location.href);
		this.socialId = this.route.snapshot.params['media'];
		if (this.route.snapshot.params['media'] === 'facebook') {
			if (localStorage.getItem('facebookDetails')) {
				console.log('facebook');
				this.socialDetails = JSON.parse(localStorage.getItem('facebookDetails'));
			}
		} else {
			this.getSocialAccount(this.socialId);
		}
		this.loadingSubject.next(false);
	}

	getSocialAccount(id) {
		this.loadingSubject.next(true);
		this.socialsService.getSingleSocial(id).subscribe(
			socialDetail => {
				console.log('sosocialls', socialDetail);
				this.loadingSubject.next(false);
				this.socialDetails = socialDetail['data'].data;
			}
		);
	}

	goBack() {
		this._location.back();
	}

	onDelete() {
		if (this.route.snapshot.params['media'] === 'facebook') {
			localStorage.setItem('facebookDetails', '');
			return this.router.navigate(['/cdash/socials/socials']);
		}
		const _title: string = 'Delete Account';
		const _description: string = 'Are you sure to permanently delete the account?';
		const _waitDesciption: string = 'Acount will be deleted...';
		const _deleteMessage = `Account has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.socialsService.deleteAccount(this.socialId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/cdash/socials/socials']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}
}
