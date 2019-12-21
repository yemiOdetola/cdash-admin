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
import { SalesComponent } from './sales.component';
// Sales Actions
import { SalesListComponent } from './sales-list/sales-list.component';
import { SaleEditComponent } from './sale-edit/sale-edit.component';
import { SaleComponent } from './sale/sale.component';
import { StatusEditDialogComponent } from './sale-edit/status-edit/status-edit.dialog.component';
import { ChangeStatusDialogComponent } from './sales-list/change-status-dialog/change-status-dialog.component';
import { ShowInvoiceComponent } from './show-invoice/show-invoice.component';


// Core => utils
import { HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../../core/_base/crud';

// Core => service
import { SalesService } from '../../../../core/sales';
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
		component: SalesComponent,
		children: [
			{
				path: '',
				redirectTo: 'sales',
				pathMatch: 'full'
			},
			{
				path: 'sales',
				component: SalesListComponent,
				pathMatch: 'full'
			},
			{
				path: 'manage',
				component: SaleEditComponent
			},
			{
				path: 'preview',
				component: ShowInvoiceComponent
			},
			{
				path: 'manage/:id',
				component: SaleEditComponent
			},
			{
				path: 'sale/:id',
				component: SaleComponent,
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
		SalesService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		StatusEditDialogComponent,
		ChangeStatusDialogComponent
	],
	declarations: [
		SalesComponent,
		SalesListComponent,
		SaleEditComponent,
		SaleComponent,
		StatusEditDialogComponent,
		ChangeStatusDialogComponent,
		ShowInvoiceComponent
	]
})
export class SalesModule { }
