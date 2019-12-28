import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../../core/users';
import { RolesService } from '../../../../../core/roles';
import { LayoutUtilsService } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';


@Component({
	selector: 'kt-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	userId: string;
	userDetails: any;
	pageTitle = 'Please wait...';
	nairaSign = '₦';
	roles = [];
	roleId;
	rolePerm;
	roleName;
	constructor(
		private route: ActivatedRoute,
		private usersService: UserService,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router,
		private rolesService: RolesService,
		private _location: Location,
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.userId = this.route.snapshot.params['id'];
		this.usersService.getUserById(this.userId).subscribe(
			singleUser => {
				this.userDetails = singleUser['data'];
				this.getAllRoles();
				this.pageTitle = `${this.userDetails.name}`;
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
	}

	replaceUnderscore(string) {
		return string.replace('_', ' ');
	}


	getAllRoles() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.rolesService.getRoles(0, 999).subscribe(
			responseData => {
				this.roles = responseData['data'];
				this.roles.forEach(role => {
					if (this.userDetails.role === role._id) {
						console.log(role, this.userDetails.role);
						this.rolePerm = role.permissions;
						this.roleName = role.name;
					}
				});
				this.loadingSubject.next(false);
			},
			error => {
				console.log('error', error);
			}
		);
	}

	goBack() {
		this._location.back();
	}
}
