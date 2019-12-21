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
// Componentsimport { ChangeStatusDialogComponent } from './campaigns-list/change-status-dialog/change-status-dialog.component';

import { CampaignsComponent } from './campaigns.component';
// Leads Actions
import { CampaignsListComponent } from './campaigns-list/campaigns-list.component';
import { CampaignEditComponent } from './campaign-edit/campaign-edit.component';
import { CampaignComponent } from './campaign/campaign.component';
import { ChangeStatusDialogComponent } from './campaigns-list/change-status-dialog/change-status-dialog.component';


// Core => utils
import { HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../../core/_base/crud';

// Core => service
import { CampaignsService } from '../../../../core/campaigns';
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
		component: CampaignsComponent,
		children: [
			{
				path: '',
				redirectTo: 'campaigns',
				pathMatch: 'full'
			},
			{
				path: 'campaigns',
				component: CampaignsListComponent,
				pathMatch: 'full'
			},
			{
				path: 'campaign/:id',
				component: CampaignComponent,
			},
			{
				path: 'campaign/create/:id',
				component: CampaignEditComponent
			},
			{
				path: 'manage',
				component: CampaignEditComponent
			},
			{
				path: 'manage/:id',
				component: CampaignEditComponent
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
		CampaignsService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		ChangeStatusDialogComponent
	],
	declarations: [
		CampaignsComponent,
		CampaignsListComponent,
		CampaignEditComponent,
		CampaignComponent,
		ChangeStatusDialogComponent
	]
})
export class CampaignsModule { }
