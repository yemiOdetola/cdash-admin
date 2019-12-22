// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
// Services and Models
import { RolesService } from '../../../../../core/roles';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-roles-list',
	templateUrl: './roles-list.component.html',
	styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	roles: any[];
	resultsLength: number = 0;
	pageIndex = 0;
	limit = 10;
	disablePrev = true;
	disableNext = false;
	claimRoles;
	users = [];
	allUsers;
	roleSelect = true;
	hodsUsers;
	currentHOD = 0;
	constructor(private rolesService: RolesService,
		private layoutUtilsService: LayoutUtilsService,
		private _location: Location,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.rolesService.getRolesCount().subscribe(
			countResult => {
				this.resultsLength = countResult['data'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
				if (this.resultsLength <= 10) {
					console.log('not up to 10', this.resultsLength);
					this.disableNext = true;
				} else {
					console.log('up to 10', this.resultsLength);
					this.disableNext = false;
				}
			}
		);
		let skip = this.pageIndex * this.limit;
		this.getAllRoles(skip, this.limit);
	}

	replaceUnderscore(string) {
		return string.replace('_', ' ');
	}

	countRoles() {
		this.rolesService.getRolesCount().subscribe(
			countResult => {
				this.resultsLength = countResult['data'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
			}
		);
	}

	getAllRoles(skip, limit) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.rolesService.getRoles(skip, limit).subscribe(
			responseData => {
				this.roles = responseData['data'];
				console.log(this.roles);
				this.loadingSubject.next(false);
				console.log('all roles returned', this.roles);
			},
			error => {
				console.log('error', error);
			}
		);
	}

	onDelete(id) {
		const _title: string = 'Delete Role';
		const _description: string = 'Are you sure to permanently delete this Role?';
		const _waitDesciption: string = 'Deleting Role';
		const _deleteMessage = `Role has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.rolesService.deleteRole(id).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.countRoles();
					let skip = this.pageIndex * this.limit;
					this.getAllRoles(skip, this.limit);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
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
		this.loadingSubject.next(true);
		this.pageIndex = this.pageIndex + 1;
		let skip = this.pageIndex * this.limit;
		this.getAllRoles(skip, this.limit);
		this.loadingSubject.next(false);
		this.itemNav();
		this.countRoles();
	}

	getPrev() {
		this.loadingSubject.next(true);
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getAllRoles(skip, this.limit);
		this.loadingSubject.next(false);
		this.itemNav();
		this.countRoles();
	}

	goBack() {
		this._location.back();
	}

	ngOnDestroy() { }
}
