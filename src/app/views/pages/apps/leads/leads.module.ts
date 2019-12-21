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
// Components
import { LeadsComponent } from './leads.component';
// Leads Actions
import { LeadsListComponent } from './leads-list/leads-list.component';
import { LeadEditComponent } from './lead-edit/lead-edit.component';
import { LeadComponent } from './lead/lead.component';
import { LeadsImportComponent } from './leads-import/leads-import.component';
import { ChangeStatusDialogComponent } from './leads-list/change-status-dialog/change-status-dialog.component';

// Core => utils
import { HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../../core/_base/crud';

// Core => service
import { LeadsService } from '../../../../core/leads';
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
		component: LeadsComponent,
		children: [
			{
				path: '',
				redirectTo: 'leads',
				pathMatch: 'full'
			},
			{
				path: 'leads',
				component: LeadsListComponent,
				pathMatch: 'full'
			},
			{
				path: 'manage',
				component: LeadEditComponent
			},
			{
				path: 'manage/:id',
				component: LeadEditComponent
			},
			{
				path: 'import',
				component: LeadsImportComponent
			},
			{
				path: 'lead/:id',
				component: LeadComponent,
			},
			{
				path: 'lead',
				component: LeadComponent,
			},
			{
				path: 'import',
				component: LeadsImportComponent
			}
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
		LeadsService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		ChangeStatusDialogComponent
	],
	declarations: [
		LeadsComponent,
		LeadsListComponent,
		LeadEditComponent,
		LeadComponent,
		LeadsImportComponent,
		ChangeStatusDialogComponent
	]
})
export class LeadsModule { }
