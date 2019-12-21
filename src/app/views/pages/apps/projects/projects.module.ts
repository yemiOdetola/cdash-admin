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
import { ProjectsComponent } from './projects.component';
// Leads Actions
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectComponent } from './project/project.component';
import { AddProjectUserComponent } from './add-project-user/add-project-user.component';
import { AddProjectVendorComponent } from './add-project-vendor/add-project-vendor.component';

// Core => utils
import { HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../../core/_base/crud';

import { ProjectsService } from '../../../../core/projects';
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
		component: ProjectsComponent,
		children: [
			{
				path: '',
				redirectTo: 'projects',
				pathMatch: 'full'
			},
			{
				path: 'projects',
				component: ProjectsListComponent,
			},
			{
				path: 'manage',
				component: ProjectEditComponent
			},
			{
				path: 'manage/:id',
				component: ProjectEditComponent
			},
			{
				path: 'project/:id',
				component: ProjectComponent,
			},
			{
				path: 'project/:id/add-user',
				component: AddProjectUserComponent
			},
			{
				path: 'project/:id/add-vendor',
				component: AddProjectVendorComponent
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
		ProjectsService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
	],
	declarations: [
		ProjectsComponent,
		ProjectsListComponent,
		ProjectEditComponent,
		ProjectComponent,
		AddProjectUserComponent,
		AddProjectVendorComponent
	]
})
export class ProjectsModule { }
