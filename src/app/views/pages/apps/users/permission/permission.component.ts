import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';

@Component({
	selector: 'kt-permission',
	templateUrl: './permission.component.html',
	styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	permissionId: string;
	permissionDetails: true;
	pageTitle = 'Administrator';
	constructor(
		private route: ActivatedRoute,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.permissionId = this.route.snapshot.params['id'];
	}

	onDelete() {
		const _title: string = 'Delete report';
		const _description: string = 'Are you sure to permanently delete this report?';
		const _waitDesciption: string = 'Deleting report';
		const _deleteMessage = `report has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			return;
			// this.reportsService.deleteReport(this.reportId).subscribe(
			// 	deleted => {
			// 		console.log('deleted', deleted);
			// 		this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			// 		this.router.navigate(['/strada/reports/reports']);
			// 	},
			// 	error => {
			// 		console.log('error', error);
			// 		this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
			// 	}
			// );
		});
	}
	showNewUserForm() {
		console.log('shhhhhhhhh');
	}
}
