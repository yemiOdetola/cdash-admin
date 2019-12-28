// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './base/base.component';
import { ErrorPageComponent } from './content/error-page/error-page.component';
// Auth
import { AuthGuard } from '../../../core/auth';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'dashboard',
				loadChildren: 'app/views/pages/dashboard/dashboard.module#DashboardModule'
			},
			// {
			// 	path: 'mail',
			// 	loadChildren: 'app/views/pages/apps/mail/mail.module#MailModule'
			// },
			// {
			// 	path: 'mails',
			// 	loadChildren: 'app/views/pages/apps/mails/mails.module#MailsModule'
			// },
			// {
			// 	path: 'leads',
			// 	loadChildren: 'app/views/pages/apps/leads/leads.module#LeadsModule',
			// },
			{
				path: 'assets',
				loadChildren: 'app/views/pages/apps/assets/assets.module#AssetsModule',
			},
			// {
			// 	path: 'accounting',
			// 	loadChildren: 'app/views/pages/apps/accounting/accounting.module#AccountingModule'
			// },
			// {
			// 	path: 'calls',
			// 	loadChildren: 'app/views/pages/apps/calls/calls.module#CallsModule'
			// },
			// {
			// 	path: 'contacts',
			// 	loadChildren: 'app/views/pages/apps/contacts/contacts.module#ContactsModule'
			// },
			// {
			// 	path: 'vendors',
			// 	loadChildren: 'app/views/pages/apps/vendors/vendors.module#VendorsModule'
			// },
			{
				path: 'profile',
				loadChildren: 'app/views/pages/apps/profile/profile.module#ProfileModule'
			},
			{
				path: 'users',
				loadChildren: 'app/views/pages/apps/users/users.module#UsersModule'
			},
			// {
			// 	path: 'sales',
			// 	loadChildren: 'app/views/pages/apps/sales/sales.module#SalesModule'
			// },
			// {
			// 	path: 'hr',
			// 	loadChildren: 'app/views/pages/apps/hr/hr.module#HRModule'
			// },
			{
				path: 'organizations',
				loadChildren: 'app/views/pages/apps/organizations/organizations.module#OrganizationsModule'
			},
			{
				path: 'projects',
				loadChildren: 'app/views/pages/apps/projects/projects.module#ProjectsModule'
			},
			{
				path: 'computations',
				loadChildren: 'app/views/pages/apps/computations/computations.module#ComputationsModule'
			},
			{
				path: 'logs',
				loadChildren: 'app/views/pages/apps/logs/logs.module#LogsModule'
			},
			// {
			// 	path: 'meetings',
			// 	loadChildren: 'app/views/pages/apps/meetings/meetings.module#MeetingsModule'
			// },
			{
				path: 'socials',
				loadChildren: 'app/views/pages/apps/socials/socials.module#SocialsModule'
			},
			{
				path: 'reports',
				loadChildren: 'app/views/pages/apps/report/reports.module#ReportsModule'
			},
			// {
			// 	path: 'campaigns',
			// 	loadChildren: 'app/views/pages/apps/campaigns/campaigns.module#CampaignsModule'
			// },
			// {
			// 	path: 'campaign-types',
			// 	loadChildren: 'app/views/pages/apps/campaign-types/campaign-types.module#CampaignTypesModule'
			// },
			{
				path: 'md-tasks',
				loadChildren: 'app/views/pages/apps/md-tasks/md-tasks.module#MdTasksModule'
			},
			// {
			// 	path: 'ngbootstrap',
			// 	loadChildren: 'app/views/pages/ngbootstrap/ngbootstrap.module#NgbootstrapModule'
			// },
			// {
			// 	path: 'material',
			// 	loadChildren: 'app/views/pages/material/material.module#MaterialModule'
			// },
			// {
			// 	path: 'builder',
			// 	loadChildren: 'app/views/themes/demo1/content/builder/builder.module#BuilderModule'
			// },
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					'type': 'error-v6',
					'code': 403,
					'title': '403... Access forbidden',
					'desc': 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
				}
			},
			{path: 'error/:type', component: ErrorPageComponent},
			{path: '', redirectTo: 'dashboard', pathMatch: 'full'},
			{path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PagesRoutingModule {
}
