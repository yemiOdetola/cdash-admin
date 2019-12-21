// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
// Auth
import { ModuleGuard } from '../../../../core/auth';
// UI
import { PartialsModule } from '../../../partials/partials.module';
// Components
import { MdTasksComponent } from './md-tasks.component';
// Leads Actions
import { MdTasksListComponent } from './md-tasks-list/md-tasks-list.component';
import { MdTaskEditComponent } from './md-task-edit/md-task-edit.component';
import { MdTaskComponent } from './md-task/md-task.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { TaskCalenderComponent } from './task-calender/task-calender.component';
import { ChangeStatusDialogComponent } from './md-tasks-list/change-status-dialog/change-status-dialog.component';
import { MyChangeStatusDialogComponent } from './my-tasks/change-status-dialog/change-status-dialog.component';

// Core => utils
import { HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../../core/_base/crud';

// Core => service
import { MdTasksService } from '../../../../core/md-tasks';
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
		component: MdTasksComponent,
		children: [
			{
				path: '',
				redirectTo: 'md-tasks',
				pathMatch: 'full'
			},
			{
				path: 'md-tasks',
				component: MdTasksListComponent,
				canActivate: [AuthGuardService]
			},
			{
				path: 'my-tasks',
				component: MyTasksComponent
			},
			{
				path: 'tasks-calender',
				component: TaskCalenderComponent
			},
			{
				path: 'manage',
				component: MdTaskEditComponent
			},
			{
				path: 'manage/:id',
				component: MdTaskEditComponent
			},
			{
				path: 'md-task/:id',
				component: MdTaskComponent,
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
		MdTasksService,
		AuthGuardService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		ChangeStatusDialogComponent,
		MyChangeStatusDialogComponent
	],
	declarations: [
		MdTasksComponent,
		MdTasksListComponent,
		MdTaskEditComponent,
		MdTaskComponent,
		MyTasksComponent,
		ChangeStatusDialogComponent,
		MyChangeStatusDialogComponent,
		TaskCalenderComponent
	]
})
export class MdTasksModule { }
