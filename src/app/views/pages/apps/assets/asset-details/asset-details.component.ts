import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadModel, LeadsService } from '../../../../../core/leads';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-lead',
	templateUrl: './lead.component.html',
	styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	leadId: string;
	leadDetails: any;
	pageTitle = 'Please wait...';
	constructor(
		private route: ActivatedRoute,
		private leadsService: LeadsService,
		private _location: Location,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.leadId = this.route.snapshot.params['id'];
		this.leadsService.getLeadById(this.leadId).subscribe(
			singleLead => {
				this.leadDetails = singleLead['success'];
				console.log('this lead details oninit', this.leadDetails);
				this.loadingSubject.next(false);
				this.pageTitle = `${this.leadDetails.company}`;
			},
			error => {
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
		console.log('id returned', this.route.snapshot.params['id']);
	}

	goBack() {
		this._location.back();
	}

	onConvert() {
		this.leadsService.convertLead(this.leadId).subscribe(
			data => {
				console.log('success reponse', data);
				this.loadingSubject.next(false);
				const message = `Lead has been Successfully Converted`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/strada/contacts/contacts']);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	onDelete() {
		const _title: string = 'Delete Lead';
		const _description: string = 'Are you sure to permanently delete this lead?';
		const _waitDesciption: string = 'lead is deleting...';
		const _deleteMessage = `lead has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.leadsService.deleteLead(this.leadId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/strada/leads/leads']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}
}

	// handleProceedings(e) {
	// 	if (this.typeSelectorGroup.value.noteType === 'Contact') {
	// 		this.proceedingOption = 'Contact';
	// 	}
	// 	if (this.typeSelectorGroup.value.noteType === 'Competition') {
	// 		this.proceedingOption = 'Competition';
	// 	}
	// 	if (this.typeSelectorGroup.value.noteType === 'Note') {
	// 		this.proceedingOption = 'Note';
	// 	}
	// }
