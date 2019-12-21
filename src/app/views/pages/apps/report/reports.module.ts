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

import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// Components
import { ReportsComponent } from './reports.component';
// Leads Actions
import { ReportsListComponent } from './reports-list/reports-list.component';
import { ReportsGroupComponent } from './reports-group/reports-group.component';
import { ReportEditComponent } from './report-edit/report-edit.component';
import { ReportComponent } from './report/report.component';
import { ReportAnalyticsComponent } from './report-analytics/report-analytics.component';

// Core => utils
import { HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../../core/_base/crud';

// Core => service
import { ReportsService } from '../../../../core/reports';
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
		component: ReportsComponent,
		children: [
			{
				path: '',
				redirectTo: 'group',
				pathMatch: 'full'
			},
			{
				path: 'manage',
				component: ReportEditComponent
			},
			{
				path: 'analytics',
				component: ReportAnalyticsComponent
			},
			{
				path: 'group',
				component: ReportsGroupComponent
			},
			{
				path: 'manage/:id',
				component: ReportEditComponent
			},
			{
				path: 'reports/:id',
				component: ReportsListComponent,
			},
			{
				path: 'report/:id',
				component: ReportComponent,
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
		InfiniteScrollModule
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
		ReportsService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
	],
	declarations: [
		ReportsComponent,
		ReportsListComponent,
		ReportEditComponent,
		ReportComponent,
		ReportAnalyticsComponent,
		ReportsGroupComponent
	]
})
export class ReportsModule { }
