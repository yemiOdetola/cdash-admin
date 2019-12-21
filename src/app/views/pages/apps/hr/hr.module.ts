// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Auth
import { ModuleGuard } from '../../../../core/auth';
// UI
import { PartialsModule } from '../../../partials/partials.module';
// Components
import { HRComponent } from './hr.component';
// Claims Actions
import { ClaimsListComponent } from './claims-list/claims-list.component';
import { LoansListComponent } from './loans-list/loans-list.component';
import { LeavesListComponent } from './leaves-list/leaves-list.component';
import { ClaimComponent } from './claim/claim.component';
import { LoanComponent } from './loan/loan.component';
import { LeaveComponent } from './leave/leave.component';
import { ClaimEditComponent } from './claim-edit/claim-edit.component';
import { LoanEditComponent } from './loan-edit/loan-edit.component';
import { LeaveEditComponent } from './leave-edit/leave-edit.component';
import { ApprovalListComponent } from './approval-list/approval-list.component';
import { ApprovalSummaryComponent } from './approval-summary/approval-summary.component';
import { ApprovedListComponent } from './approved-list/approved-list.component';

// Core => utils
import {
	HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../../core/_base/crud';

// Core => service
import { ClaimsService } from '../../../../core/claims';

import { AuthGuardService } from '../../../../core/guard';
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
		component: HRComponent,
		children: [
			{
				path: '',
				redirectTo: 'claims',
				pathMatch: 'full'
			},
			{
				path: 'claim',
				component: ClaimEditComponent,
			},
			{
				path: 'loan',
				component: LoanEditComponent
			},
			{
				path: 'leave',
				component: LeaveEditComponent
			},
			{
				path: 'claim/edit/:id',
				component: ClaimEditComponent
			},
			{
				path: 'loan/edit/:id',
				component: LoanEditComponent
			},
			{
				path: 'leave/edit/:id',
				component: LeaveEditComponent
			},
			{
				path: 'claims',
				component: ClaimsListComponent,
				pathMatch: 'full'
			},
			{
				path: 'loans',
				component: LoansListComponent
			},
			{
				path: 'leaves',
				component: LeavesListComponent
			},
			{
				path: 'approval-list',
				component: ApprovalListComponent,
				canActivate: [AuthGuardService]
			},
			{
				path: 'approval-summary',
				component: ApprovalSummaryComponent,
				canActivate: [AuthGuardService]
			},
			{
				path: 'approved-list',
				component: ApprovedListComponent,
				canActivate: [AuthGuardService]
			},
			{
				path: 'claim/:id',
				component: ClaimComponent,
			},
			{
				path: 'loan/:id',
				component: LoanComponent,
			},
			{
				path: 'leave/:id',
				component: LeaveComponent,
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
		MatStepperModule
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
		ClaimsService,
		AuthGuardService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
	],
	declarations: [
		HRComponent,
		ClaimsListComponent,
		LoansListComponent,
		LeavesListComponent,
		ClaimEditComponent,
		LoanEditComponent,
		LeaveEditComponent,
		ClaimComponent,
		LoanComponent,
		LeaveComponent,
		ApprovalListComponent,
		ApprovalSummaryComponent,
		ApprovedListComponent
	]
})
export class HRModule { }
