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
import { CampaignTypesComponent } from './campaign-types.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { CampaignTypeComponent } from './campaign/campaign.component';

// Core => utils
import { HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../../core/_base/crud';

// Core => service
import { CampaignsService } from '../../../../core/campaign-types';
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
import { CampaignsListComponent } from './campaign-list/campaigns-list.component';

// tslint:disable-next-line:class-name
const routes: Routes = [
	{
		path: '',
		component: CampaignTypesComponent,
		children: [
			{
				path: '',
				redirectTo: 'campaign-types',
				pathMatch: 'full'
			},
			{
				path: 'campaign-types',
				component: CampaignsListComponent
			},
			{
				path: 'campaign-type/:id',
				component: CampaignTypeComponent
			},
			{
				path: 'manage',
				component: CreateCampaignComponent
			},
			{
				path: 'manage/:id',
				component: CreateCampaignComponent
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
		CampaignsService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
	],
	declarations: [
		CampaignTypesComponent,
		CreateCampaignComponent,
		CampaignsListComponent,
		CampaignTypeComponent
	]
})
export class CampaignTypesModule { }
