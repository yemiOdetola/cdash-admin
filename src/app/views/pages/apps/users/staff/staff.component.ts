import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../../core/users';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';


@Component({
	selector: 'kt-staff',
	templateUrl: './staff.component.html',
	styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	staffId: string;
	staffDetails: any;
	pageTitle = 'Please wait...';
	hod: any;
	nairaSign = '₦';
	constructor(
		private route: ActivatedRoute,
		private usersService: UserService,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router,
		private _location: Location,
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.staffId = this.route.snapshot.params['id'];
		this.usersService.getStaffById(this.staffId).subscribe(
			singleStaff => {
				this.staffDetails = singleStaff['data'];
				console.log('this user details oninit', this.staffDetails);
				this.pageTitle = `${this.staffDetails.name}`;
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
	}

	goBack() {
		this._location.back();
	}

	onDelete() {
		const _title: string = 'Delete staff';
		const _description: string = 'Are you sure to permanently delete this staff?';
		const _waitDesciption: string = 'Deleting staff';
		const _deleteMessage = `Staff has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.usersService.deleteStaff(this.staffId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/cdash/users/staffs']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}
}
