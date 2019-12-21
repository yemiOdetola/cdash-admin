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
import { CallsComponent } from './calls.component';
import { CallComponent } from './call/call.component';
import { CallLogEditComponent } from './call-log-edit/call-log-edit.component';
import { CallLogListComponent } from './call-log-list/call-log-list.component';
import { DevicesListComponent } from './devices-list/devices-list.component';
import { DeviceComponent } from './device/device.component';
import { DevicesEditComponent } from './device-edit/devices-edit.component';
import { ConvertToLeadComponent } from './convert-to-lead/convert-to-lead.component';
import { ConvertToContactComponent } from './convert-to-contact/convert-to-contact.component';

// Core => utils
import { HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../../core/_base/crud';

// Core => service
import { CallsService } from '../../../../core/calls';
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
import { from } from 'rxjs';

// tslint:disable-next-line:class-name
const routes: Routes = [
	{
		path: '',
		component: CallsComponent,
		children: [
			{
				path: '',
				redirectTo: 'calls',
				pathMatch: 'full'
			},
			{
				path: 'calls',
				component: CallLogListComponent
			},
			{
				path: 'call/:id', // single call details
				component: CallComponent
			},
			{
				path: 'call/:id/convert-to-lead',
				component: ConvertToLeadComponent
			},
			{
				path: 'call/:id/convert-to-contact',
				component: ConvertToContactComponent
			},
			{
				path: 'manage/:id', // edit call details
				component: CallLogEditComponent
			},
			{
				path: 'devices',
				component: DevicesListComponent
			},
			{
				path: 'device/:id', // single device details
				component: DeviceComponent
			},
			{
				path: 'devices/manage/:id', // edit device details
				component: DevicesEditComponent
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
		CallsService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
	],
	declarations: [
		CallsComponent,
		CallComponent,
		CallLogEditComponent,
		CallLogListComponent,
		DevicesListComponent,
		DeviceComponent,
		DevicesEditComponent,
		ConvertToLeadComponent,
		ConvertToContactComponent
	]
})
export class CallsModule { }
