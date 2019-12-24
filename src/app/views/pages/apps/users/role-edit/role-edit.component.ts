// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { RoleModel, RolesService } from '../../../../../core/roles';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-role-edit',
	templateUrl: './role-edit.component.html',
	styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit, OnDestroy {
	role: RoleModel;
	image: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	oldCRole: RoleModel;
	roleForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	objectKeys = Object.keys;
	permissionTypes: any;
	selectedRole = '';
	selectedTab: number = 0;
	selectedFile: File = null;
	idParams: string;
	good: string;
	roleMap: any;
	myRoles: any;
	cRole: any;
	stMap: any;
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private rolesService: RolesService
	) {
		//
	}

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.permissionTypes = [
			{ 'label': 'Log', 'value': 'log' },
			{ 'label': 'Edit', 'value': 'edit' },
			{ 'label': 'View income', 'value': 'view_income' },
			{ 'label': 'View financial', 'value': 'view_financial' },
		];
		console.log('RoleEditComponent initiated');
		this.initRoleForm();
		if (this.activatedRoute.snapshot.params['id']) {
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getRoleDetails().subscribe(roleData => this.initRoleForm(roleData));
			this.loadingSubject.next(true);
		} else {
			this.role = this.roleForm.value;
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		console.log(this.roleForm.value);
		console.log('form control', this.roleForm.controls);
		this.roleMap = {};
		this.stMap = {};
		this.myRoles = [];
		this.permissionTypes.forEach((e) => {
			this.stMap[e.value] = e.label;
		});
	}

	handleRoleChange(event) {
		if (event.target.value === '') {
			return;
		}
		this.cRole = event.target.value;
		this.rolePush();
	}

	roleChanged(role) {
		console.log('role', role);
		this.cRole = role.value;
		this.rolePush();
	}
	rolePush() {
		if (this.roleMap[this.cRole] === undefined || this.roleMap[this.cRole] === false) {
			this.myRoles.push(this.cRole);
			this.roleMap[this.cRole] = true;
		}
	}
	roleRemove(role) {
		if (this.roleMap[role]) {
			let filtered = this.myRoles.filter(function(value, index, arr) {

				return value !== role;
			});
			this.myRoles = filtered;
			this.roleMap[role] = false;
		}
	}

	getRoleDetails() {
		return this.rolesService.getRoleById(this.idParams).pipe(
			map(roleDetails => {
				this.role = roleDetails['data'];
				this.loadingSubject.next(false);
				console.log('retrieving role with pipe', this.role);
				return this.role;
			})
		);
	}

	initRoleForm(role: any = {}) {
		this.roleForm = this.fb.group({
			name: [role.name || '', Validators.required],
		});

	}

	titleCase(str: any) {
		let splitStr = str.toLowerCase().split(' ');
		for (let i = 0; i < splitStr.length; i++) {
			splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
		}
		return splitStr.join(' ');
	}
	getComponentTitle() {
		let result = 'Please Wait';
		if (!this.role || !this.role._id) {
			result = 'Create New Role';
			return result;
		}
		result = `Edit Role -  ${this.titleCase(this.role.name)}`;
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.roleForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.roleForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.role._id) {
			console.log('Role has an Id');
			let editedRole = this.roleForm.value;
			console.log('Role to send', editedRole);
			this.updateRole(editedRole);
			return;
		}
		this.addRole(this.roleForm.value);
	}

	updateRole(role) {
		const payload = this.roleForm.value;
		if (this.myRoles.length > 0) {
			payload.permissions = this.myRoles;
			this.rolesService.updateRole(role, this.role._id).subscribe(
				data => {
					console.log('success reponse', data);
					this.loadingSubject.next(false);
					const message = `Updated Successfully`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
					this.router.navigate(['/cdash/users/roles']);
				},
				error => {
					this.loadingSubject.next(false);
					console.log('Error response', error);
					const title = 'Please Retry';
					const message = 'Sorry, Temporary Error Occured';
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				});
		} else {
			const message = `Please Add permissions for this role`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
		}
	}
	/**
	 * Add Role
	 *
	 * @param _role: RoleModel
	 * @param withBack: boolean
	 */
	addRole(_role: RoleModel, withBack: boolean = false) {
		this.loadingSubject.next(true);
		const payload = this.roleForm.value;
		console.log(payload);
		if (this.myRoles.length > 0) {
			payload.permissions = this.myRoles;
			this.rolesService.createRole(payload).subscribe(
				data => {
					this.loadingSubject.next(false);
					console.log('success reponse', data);
					const message = `Role has been Successfully Created`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
					this.router.navigate(['/cdash/users/roles']);
				}, error => {
					this.loadingSubject.next(false);
					console.log('Error response', error);
					const title = 'Please Retry';
					const message = 'Sorry, Temporary Error Occured';
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				});
		} else {
			const message = `Please Add permissions for this role`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
		}
	}

	reset() {
		this.role = Object.assign({}, this.oldCRole);
		this.initRoleForm();
		this.hasFormErrors = false;
		this.roleForm.markAsPristine();
		this.roleForm.markAsUntouched();
		this.roleForm.updateValueAndValidity();
	}
	/**
	 * Close alert
	 *
	 * @param $event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() { }

}
