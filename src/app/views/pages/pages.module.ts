// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// NgBootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
// import { MailModule } from './apps/mail/mail.module';
import { MyPageComponent } from './my-page/my-page.component';
import { LeadsModule } from './apps/leads/leads.module';
import { MdTasksModule } from './apps/md-tasks/md-tasks.module';
import { ReportsModule } from './apps/report/reports.module';
import { MeetingsModule } from './apps/meetings/meetings.module';
// import { CampaignsModule } from './apps/campaigns/campaigns.module';
import { AssetsModule } from './apps/assets/assets.module';
// import { AccountingModule } from './apps/accounting/accounting.module';
// import { CallsModule } from './apps/calls/calls.module';
// import { ContactsModule } from './apps/contacts/contacts.module';
// import { VendorsModule } from './apps/vendors/vendors.module';
import { ProfileModule } from './apps/profile/profile.module';
import { UsersModule } from './apps/users/users.module';
// import { MailsModule } from './apps/mails/mails.module';
import { SalesModule } from './apps/sales/sales.module';
// import { HRModule } from './apps/hr/hr.module';
import { OrganizationsModule } from './apps/organizations/organizations.module';
import { ProjectsModule } from './apps/projects/projects.module';
import { ComputationsModule } from './apps/computations/computations.module';
import { LogsModule } from './apps/logs/logs.module';
import { SocialsModule } from './apps/socials/socials.module';
// import { CampaignTypesModule } from './apps/campaign-types/campaign-types.module';

@NgModule({
	declarations: [MyPageComponent],
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		NgbModule,
		CoreModule,
		PartialsModule,
		// MailModule,
		LogsModule,
		LeadsModule,
		AssetsModule,
		// CallsModule,
		// CampaignTypesModule,
		// ContactsModule,
		// AccountingModule,
		// CampaignsModule,
		MdTasksModule,
		ProjectsModule,
		ComputationsModule,
		ReportsModule,
		SocialsModule,
		// VendorsModule,
		ProfileModule,
		UsersModule,
		// MailsModule,
		SalesModule,
		// HRModule,
		OrganizationsModule,
		MeetingsModule
	],
	providers: []
})
export class PagesModule {
}
