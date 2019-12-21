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
import { ContactsComponent } from './contacts.component';
// Leads Actions
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { ContactEditComponent } from './contact-edit/contact-edit.component';
import { ContactComponent } from './contact/contact.component';
import { ContactsImportComponent } from './import/import.component';
import {ChangeStatusDialogComponent} from './contacts-list/change-status-dialog/change-status-dialog.component';

// Core => utils
import { HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../../core/_base/crud';

// Core => service
import { ContactsService } from '../../../../core/contacts';
import { UploadService } from '../../../../core/upload';
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
		component: ContactsComponent,
		children: [
			{
				path: '',
				redirectTo: 'contacts',
				pathMatch: 'full'
			},
			{
				path: 'contacts',
				component: ContactsListComponent,
			},
			{
				path: 'manage',
				component: ContactEditComponent
			},
			{
				path: 'manage/:id',
				component: ContactEditComponent
			},
			{
				path: 'contact/:id',
				component: ContactComponent,
			},
			{
				path: 'import',
				component: ContactsImportComponent
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
		ContactsService,
		UploadService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		ChangeStatusDialogComponent
	],
	declarations: [
		ContactsComponent,
		ContactsListComponent,
		ContactEditComponent,
		ContactComponent,
		ContactsImportComponent,
		ChangeStatusDialogComponent
	]
})
export class ContactsModule { }
