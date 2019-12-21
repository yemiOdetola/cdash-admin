// Angular
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MessagingService } from '../../../../../core/push-notification';

@Component({
	selector: 'kt-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['notification.component.scss']
})
export class NotificationComponent implements OnInit {

	// Show dot on top of the icon
	@Input() dot: boolean;

	// Show pulse on icon
	@Input() pulse: boolean;

	@Input() pulseLight: boolean;

	// Set icon class name
	@Input() icon: string = 'flaticon2-bell-alarm-symbol';
	@Input() iconType: '' | 'success';

	// Set true to icon as SVG or false as icon class
	@Input() useSVG: boolean;

	// Set bg image path
	@Input() bgImage: string;

	// Set skin color, default to light
	@Input() skin: 'light' | 'dark' = 'light';

	@Input() type: 'brand' | 'success' = 'success';
	message;
	notifications;
	notificationId = '';
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	currentTime;
	/**
	 * Component constructor
	 *
	 * @param sanitizer: DomSanitizer
	 */
	constructor(
		private sanitizer: DomSanitizer,
		private messagingService: MessagingService) {
	}

	ngOnInit() {
		this.messagingService.receiveMessage();
		this.message = this.messagingService.currentMessage;
		this.messagingService.getNotificationsCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.resultsLength <= 10) {
					console.log('not up to 10', this.resultsLength);
					this.disableNext = true;
				} else {
					console.log('up to 10', this.resultsLength);
					this.disableNext = false;
				}
			}
		);
		this.currentTime = Date.now();
		let skip = this.pageIndex * this.limit;
		this.getNotifications(skip, this.limit);
	}

	getNotifCount() {
		this.messagingService.getNotificationsCount().subscribe(
			countResult => {
				this.resultsLength = countResult['count'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}

	itemNav() {
		if (((this.pageIndex * 10) + 10) >= this.resultsLength) {
			this.disableNext = true;
			console.log('paste total numbers');
			// return;
		} else {
			this.disableNext = false;
		}
		if (this.pageIndex === 0) {
			this.disablePrev = true;
			console.log('last page');
			// return;
		} else {
			this.disablePrev = false;
		}
	}

	getNext() {
		this.pageIndex = this.pageIndex + 1;
		let skip = this.pageIndex * this.limit;
		this.getNotifications(skip, this.limit);
		this.getNotifCount();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getNotifications(skip, this.limit);
		this.getNotifCount();
		this.itemNav();
	}

	getNotifications(skip, limit) {
		this.messagingService.getNotifications(skip, limit).subscribe(
			messages => {
				this.notifications = messages['success'];
				// if (this.notifications) {
				// 	this.notificationId = this.notifications[0]._id;
				// }
				console.log('messages', messages);
				console.log('this lead details oninit', this.notifications);
			},
			error => {
				console.log('error occured', error);
			}
		);
	}
	// viewNotification
	viewNotification(id) {
		this.messagingService.viewNotification(id).subscribe(
			responseData => {
				console.log(responseData, '>>>>response');
				let skip = this.pageIndex * this.limit;
				this.getNotifications(skip, this.limit);
			},
			error => {
				console.log(error, '>>>>error');
			}
		);
	}

	confirmViewed() {
		if (this.notifications.length > 0) {
			this.notifications.forEach(notification => {
				this.viewNotification(notification._id);
			});
		}
	}

	backGroundStyle(): string {
		if (!this.bgImage) {
			return 'none';
		}

		return 'url(' + this.bgImage + ')';
	}
}
