// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// NgBootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { DashboardComponent } from './dashboard.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatMenuModule, MatStepperModule } from '@angular/material';
import { NgCircleProgressModule } from 'ng-circle-progress';
// import { GtoLvlCircleComponent } from '@gto/lvl-circle';

@NgModule({
	imports: [
		CommonModule,
		PartialsModule,
		CoreModule,
		NgbModule,
		FullCalendarModule,
		MatMenuModule,
		MatStepperModule,
		RouterModule.forChild([
			{
				path: '',
				component: DashboardComponent
			},
		]),
		NgCircleProgressModule.forRoot({
			// set defaults here
			radius: 90,
			outerStrokeWidth: 12,
			innerStrokeWidth: 8,
			animationDuration: 300,
			subtitleFontSize: '14',
			showInnerStroke: false,
			showUnits: false,
			unitsColor: '#000',
			subtitleColor: '#444',
			showTitle: false,
			showSubtitle: true,
			animation: false,
			outerStrokeGradient: true
		}),
	],
	providers: [],
	declarations: [
		DashboardComponent
	]
})

export class DashboardModule { }
