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
import { AssetsComponent } from './assets.component';
// Assets Actions
import { AssetsListComponent } from './assets-list/assets-list.component';
import { AssetEditComponent } from './asset-edit/asset-edit.component';
import { AssetComponent } from './asset/asset.component';
import { AssetsDataComponent } from './assets-data/assets-data.component';
import { AssetDataComponent } from './asset-data/asset-data.component';
import { AssetDetailsComponent } from './asset-details/asset-details.component';
import { AssetContainerComponent } from './asset-container/asset-container.component';

// Core => utils
import { HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../../core/_base/crud';

// Core => service
import { AssetsService } from '../../../../core/assets';
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
		component: AssetsComponent,
		children: [
			{
				path: '',
				redirectTo: 'assets',
				pathMatch: 'full'
			},
			{
				path: 'assets',
				component: AssetsListComponent,
				pathMatch: 'full'
			},
			{
				path: 'data/:id',
				component: AssetsDataComponent,
			},
			{
				path: 'manage',
				component: AssetEditComponent
			},
			{
				path: 'manage/new-asset-data',
				component: AssetDataComponent
			},
			{
				path: 'manage/asset-data/:id',
				component: AssetContainerComponent
			},
			{
				path: 'new-asset-data/details/:id',
				component: AssetDataComponent
			},
			{
				path: 'asset-details/:id',
				component: AssetDetailsComponent
			},
			{
				path: 'manage/:id',
				component: AssetEditComponent
			},
			{
				path: 'asset/:id',
				component: AssetComponent,
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
		AssetsService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
	],
	declarations: [
		AssetsComponent,
		AssetsListComponent,
		AssetEditComponent,
		AssetComponent,
		AssetsDataComponent,
		AssetDataComponent,
		AssetDetailsComponent,
		AssetContainerComponent
	]
})
export class AssetsModule { }
