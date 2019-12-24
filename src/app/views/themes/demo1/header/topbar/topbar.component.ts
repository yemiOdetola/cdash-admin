// Angular
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../core/users';

@Component({
	selector: 'kt-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
	userId = '';
	userDetails;
	constructor(
		private usersService: UserService
	) { }
	ngOnInit() {
		this.userId = localStorage.getItem('loginId');
		this.getUserDetails(this.userId);
	}
	getUserDetails(id) {
		this.usersService.getUserById(id).subscribe(
			singleUser => {
				this.userDetails = singleUser['data'];
			},
			error => {
				console.log('error occured', error);
			}
		);
	}
}
