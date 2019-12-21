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
import { AccountingComponent } from './accounting.component';
// Assets Actions
import { VendorsListComponent } from './vendors-list/vendors-list.component';
import { VendorComponent } from './vendor/vendor.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { SalesListComponent } from './sales-list/sales-list.component';
import { SaleComponent } from './sale/sale.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
// import { GoogleChartsModule } from 'angular-google-charts';
// import { ChartsModule } from 'ng2-charts';
// Core => utils
import { HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../../core/_base/crud';

// Core => service HrService
import { ContactsService } from '../../../../core/contacts';
import { VendorsService } from '../../../../core/vendors';
import { AuthGuardService } from '../../../../core/guard';
import { HrService } from '../../../../core/hr';
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
		component: AccountingComponent,
		canActivate: [AuthGuardService],
		children: [
			{
				path: '',
				redirectTo: 'analytics',
				pathMatch: 'full'
			},
			{
				path: 'analytics',
				component: AnalyticsComponent
			},
			{
				path: 'expense-management',
				component: VendorsListComponent,
			},
			{
				path: 'vendor/:id',
				component: VendorComponent,
			},
			{
				path: 'client-payments',
				component: SalesListComponent
			},
			{
				path: 'sale/:id',
				component: SaleComponent
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
		// ChartsModule
		// GoogleChartsModule.forRoot(),
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
		VendorsService,
		ContactsService,
		HrService,
		AuthGuardService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		PurchaseOrderComponent
	],
	declarations: [
		AccountingComponent,
		VendorsListComponent,
		VendorComponent,
		AnalyticsComponent,
		SalesListComponent,
		SaleComponent,
		PurchaseOrderComponent
	]
})
export class AccountingModule { }
