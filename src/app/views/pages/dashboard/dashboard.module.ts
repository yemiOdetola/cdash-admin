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
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatMenuModule, MatStepperModule } from '@angular/material';

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
			radius: 80,
			outerStrokeWidth: 13,
			innerStrokeWidth: 8,
			animationDuration: 300,
			subtitleFontSize: '15',
			showInnerStroke: false,
			showUnits: false,
			unitsColor: '#000',
			subtitleColor: '#444',
			showTitle: false,
			showSubtitle: true,
			animation: true,
			outerStrokeGradient: true
		}),
	],
	providers: [],
	declarations: [
		DashboardComponent,
	]
})

export class DashboardModule { }
