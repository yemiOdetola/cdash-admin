// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Auth
import { ModuleGuard } from '../../../../core/auth';
// UI
import { PartialsModule } from '../../../partials/partials.module';
import { FullCalendarModule } from '@fullcalendar/angular';
// Components
import { UsersComponent } from './users.component';
// Leads Actions
import { RolesListComponent } from './role-list/roles-list.component';
import { StaffsListComponent } from './staffs/staffs-list.component';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { ClaimsListComponent } from './claim-list/claims-list.component';
import { ClaimEditComponent } from './claim-edit/claim-edit.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserComponent } from './user/user.component';
import { UsersBirthdayComponent } from './users-calender/users-calender.component';
import { HrDialogComponent } from './user/hr-dialog/hr-dialog.component';
import { RolesDialogComponent } from './user/roles-dialog/roles-dialog.component';
import { UsersListComponent } from './user-list/users-list.component';
import { PermissionComponent } from './permission/permission.component';
import { LeadsService } from '../../../../core/leads';
import { ContactsService } from '../../../../core/contacts';
import { CampaignsService } from '../../../../core/campaigns';
import { MeetingsService } from '../../../../core/meetings';
import { ProjectsService } from '../../../../core/projects';
import { StaffEditComponent } from './staff-edit/staff-edit.component';
import { StaffComponent } from './staff/staff.component';
import { PasswordEditComponent } from './password/password-edit.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';


// Core => utils
import {
	HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../../core/_base/crud';

// Core => service
import { UserService } from '../../../../core/users';
import { RolesService } from '../../../../core/roles';
import { ClaimsService } from '../../../../core/claims';
import {
	ActionNotificationComponent,
	DeleteEntityDialogComponent,
	FetchEntityDialogComponent,
	UpdateStatusDialogComponent
} from '../../../partials/content/crud';
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule,
	MatStepperModule
} from '@angular/material';


// tslint:disable-next-line:class-name
const routes: Routes = [
	{
		path: '',
		component: UsersComponent,
		children: [
			{
				path: '',
				redirectTo: 'users',
				pathMatch: 'full'
			},
			{
				path: 'users',
				component: UsersListComponent,
			},
			{
				path: 'staffs',
				component: StaffsListComponent
			},
			{
				path: 'roles',
				component: RolesListComponent,
			},
			{
				path: 'claims',
				component: ClaimsListComponent,
			},
			{
				path: 'manage',
				component: UserEditComponent
			},
			{
				path: 'users-birthday',
				component: UsersBirthdayComponent
			},
			{
				path: 'roles/add',
				component: RoleEditComponent
			},
			{
				path: 'roles/add/:id',
				component: RoleEditComponent
			},
			{
				path: 'claims/add',
				component: ClaimEditComponent
			},
			{
				path: 'staff/manage',
				component: StaffEditComponent
			},
			{
				path: 'staffs/:id',
				component: StaffComponent
			},
			{
				path: 'staff/manage/:id',
				component: StaffEditComponent
			},
			{
				path: 'manage/:id',
				component: UserEditComponent
			},
			{
				path: 'profile-edit',
				component: ProfileEditComponent
			},
			{
				path: 'managepassword/:id',
				component: PasswordEditComponent
			},
			{
				path: 'user/:id',
				component: UserComponent,
			},
			{
				path: 'permission/:id',
				component: PermissionComponent,
			},
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		PartialsModule,
		MatInputModule,
		MatPaginatorModule,
		MatProgressSpinnerModule,
		MatSortModule,
		MatTableModule,
		MatSelectModule,
		MatMenuModule,
		MatProgressBarModule,
		MatButtonModule,
		MatCheckboxModule,
		MatDialogModule,
		MatTabsModule,
		MatNativeDateModule,
		MatCardModule,
		MatRadioModule,
		MatIconModule,
		MatDatepickerModule,
		MatAutocompleteModule,
		MatSnackBarModule,
		MatTooltipModule,
		MatStepperModule,
		FullCalendarModule,
	],
	providers: [
		ModuleGuard,
		HttpUtilsService,
		TypesUtilsService,
		InterceptService,
		LayoutUtilsService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		UserService, RolesService, ClaimsService, LeadsService,
		ContactsService, CampaignsService, MeetingsService, ProjectsService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		HrDialogComponent,
		RolesDialogComponent
	],
	declarations: [
		UsersComponent,
		StaffsListComponent,
		StaffEditComponent,
		UsersListComponent,
		RolesListComponent,
		UserEditComponent,
		RoleEditComponent,
		ClaimEditComponent,
		ClaimsListComponent,
		UserComponent,
		UsersBirthdayComponent,
		HrDialogComponent,
		RolesDialogComponent,
		PermissionComponent,
		StaffComponent,
		PasswordEditComponent,
		ProfileEditComponent
	]
})
export class UsersModule { }
