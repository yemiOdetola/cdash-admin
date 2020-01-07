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
import { SocialsComponent } from './socials.component';
// Leads Actions
import { SocialsListComponent } from './socials-list/socials-list.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { SocialEditComponent } from './social-edit/social-edit.component';
import { SocialComponent } from './social/social.component';
import { SocialLoginModule } from 'angularx-social-login';
import { AuthServiceConfig, FacebookLoginProvider } from 'angularx-social-login';

let fbkID = localStorage.getItem('fbkID');
FacebookLoginProvider.PROVIDER_ID = fbkID;
const config = new AuthServiceConfig([
	{
		id: FacebookLoginProvider.PROVIDER_ID,
		provider: new FacebookLoginProvider(fbkID)
	},

]);

export function provideConfig() {
	return config;
}

// Core => utils
import {
	HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../../core/_base/crud';

// Core => service
import { SocialsService } from '../../../../core/socials';
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
		component: SocialsComponent,
		children: [
			{
				path: '',
				redirectTo: 'socials',
				pathMatch: 'full'
			},
			{
				path: 'socials',
				component: SocialsListComponent,
			},
			{
				path: ':media',
				component: SocialComponent
			},
			{
				path: 'manage/social',
				component: SocialEditComponent
			},
			{
				path: 'link/:id',
				component: SocialComponent,
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
		NgCircleProgressModule.forRoot({
			radius: 65,
			outerStrokeWidth: 16,
			innerStrokeWidth: 8,
			animationDuration: 300,
			subtitleFontSize: '22',
			showInnerStroke: false,
			showUnits: false,
			unitsColor: '#9D9D9D',
			showTitle: false,
			showSubtitle: true,
			animation: true,
			outerStrokeGradient: true
		}),
		SocialLoginModule
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
		SocialsService,
		{
			provide: AuthServiceConfig,
			useFactory: provideConfig
		}
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
	],
	declarations: [
		SocialsComponent,
		SocialsListComponent,
		SocialEditComponent,
		SocialComponent
	]
})
export class SocialsModule { }
