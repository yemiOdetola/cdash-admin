// Angular
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../../core/auth';
import { currentUser,  User } from '../../../../../../core/auth';
import { LayoutUtilsService, MessageType } from '../../../../../../core/_base/crud';
import { AppState } from '../../../../../../core/reducers';
import { RoleModel, RolesService } from '../../../../../../core/roles';
import { select, Store } from '@ngrx/store';
// Services and Models
import { UserModel, UserService } from '../../../../../../core/users';

@Component({
	selector: 'kt-roles-password-dialog',
	templateUrl: './roles-dialog.component.html'
})
export class RolesDialogComponent implements OnInit {
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	user$: Observable<User>;
	userDetails = '';
	form: FormGroup;
	users: UserModel[];
	userId: any;
	cRole: string;
	roles: any;
	roleMap: any;
	myRoles: any;
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<RolesDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(
		private dialogRef: MatDialogRef<RolesDialogComponent>,
		private fb: FormBuilder,
		private authService: AuthService,
		private store: Store<AppState>,
		private layoutUtilsService: LayoutUtilsService,
		private usersService: UserService,
		private rolesService: RolesService,
		@Inject(MAT_DIALOG_DATA) data) { }

	ngOnInit() {
		this.form = this.fb.group({
            old: ['', Validators.required],
            password: ['', Validators.required],
		});
		this.getRoles();
		this.roleMap = {};
		this.myRoles.forEach((e) => {
           this.roleMap[e] = true;
		});
	}
	handleRoleChange(event) {
		this.cRole = event.target.value;
		this.rolePush();
	}
	roleChanged(role) {
		this.cRole = role.name;
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
			let	filtered = this.myRoles.filter(function(value, index, arr) {

				return value  !== role;
			});
			this.myRoles = filtered;
             this.roleMap[role] = false;
		}
	}
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
	getAllUsers(id) {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.usersService.hodList(id).subscribe(
			responseData => {
				this.users = responseData['success'];
				this.loadingSubject.next(false);
				console.log('all users returned', this.users);
			},
			error => {
				console.log('error', error);
			}
		);
	}
	getRoles() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.rolesService.getEveryRoles().subscribe(
			responseData => {
				this.roles = responseData['success'];
				this.loadingSubject.next(false);
				console.log('all roles returned', this.roles);
			},
			error => {
				console.log('error', error);
			}
		);
	}
	save() {

		if ( this.userId) {
			this.loadingSubject.next(true);
			const p = {roles: this.myRoles};
			this.usersService.updateRoles(p,  this.userId).subscribe(
				data => {
					if (!data.success) {
						const msg = `Something wrong happened we are checking`;
						this.layoutUtilsService.showActionNotification(msg, MessageType.Create, 10000, true, true);
						this.dialogRef.close();
					} else {
						this.myRoles = [];
						this.roleMap = { };
						console.log('success reponse', data);
						this.loadingSubject.next(false);
						const message = `User Roles Updated Successfully`;
						this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
						this.dialogRef.close();
					}
					this.dialogRef.close();
				},
				error => {
					this.loadingSubject.next(false);
					console.log('Error response', error);
					const title = 'Please Retry';
					const message = 'Sorry, Temporary Error Occured';
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
					// this.dialogRef.close();
				});
		} else {
			const msg = `Please select an HOD`;
			this.layoutUtilsService.showActionNotification(msg, MessageType.Create, 10000, true, true);
		}

	}

	close() {
		this.dialogRef.close();
	}

	getTitle(): string {
		return 'Change Password';
	}
}
