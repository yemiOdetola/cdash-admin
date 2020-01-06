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
import { ComputationsComponent } from './computations.component';
import { ComputationsListComponent } from './computations-list/computations-list.component';
import { MaturityScoreListComponent } from './maturity-score/maturity-score-list.component';
import { ScoreEditComponent } from './score-edit/score-edit.component';
import { RecurringExpenditureComponent } from './recurring-expenditure/recurring-expenditure.component';
import { CapitalExpenditureComponent } from './capital-expenditure/capital-expenditure.component';
import { ExpensesTurnoverComponent } from './expenses-turnover/expenses-turnover.component';
import { TurnoverChartComponent } from './turnover-chart/turnover-chart.component';

import { ChartsModule } from 'ng2-charts';

// Core => utils
import {
	HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../../core/_base/crud';

// Core => service
import { ComputationsService } from '../../../../core/computations';
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
	MatStepperModule,
} from '@angular/material';

// tslint:disable-next-line:class-name
const routes: Routes = [
	{
		path: '',
		component: ComputationsComponent,
		children: [
			{
				path: '',
				redirectTo: 'maturity-scores',
				pathMatch: 'full'
			},
			{
				path: 'maturity-scores',
				component: MaturityScoreListComponent,
			},
			{
				path: 'recurring-expenditure',
				component: RecurringExpenditureComponent
			},
			{
				path: 'expenses-turnover',
				component: ExpensesTurnoverComponent
			},
			{
				path: 'expenses-turnover/chart',
				component: TurnoverChartComponent
			},
			{
				path: 'capital-expenditure',
				component: CapitalExpenditureComponent
			},
			{
				path: 'maturity-scores/manage',
				component: ScoreEditComponent,
			},
			{
				path: 'maturity-scores/manage/:id',
				component: ScoreEditComponent,
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
		ChartsModule
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
		ComputationsService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
	],
	declarations: [
		ComputationsComponent,
		ComputationsListComponent,
		MaturityScoreListComponent,
		ScoreEditComponent,
		RecurringExpenditureComponent,
		CapitalExpenditureComponent,
		ExpensesTurnoverComponent,
		TurnoverChartComponent
	]
})
export class ComputationsModule { }
