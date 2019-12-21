import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MdTaskModel, MdTasksService } from '../../../../../core/md-tasks';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-md-task',
	templateUrl: './md-task.component.html',
	styleUrls: ['./md-task.component.scss']
})
export class MdTaskComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	mdTaskId: string;
	mdTaskDetails: any;
	pageTitle = 'Please wait...';
	userDetails: any;
	user_id: string;
	constructor(
		private route: ActivatedRoute,
		private mdTasksService: MdTasksService,
		private _location: Location,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.mdTaskId = this.route.snapshot.params['id'];
		this.mdTasksService.getMdTaskById(this.mdTaskId).subscribe(
			singleMdTask => {
				this.mdTaskDetails = singleMdTask['success'];
				console.log('this mdTask details oninit', this.mdTaskDetails);
				this.loadingSubject.next(false);
				this.pageTitle = `${this.mdTaskDetails.name} - ${this.mdTaskDetails.status}`;
				let userId = this.mdTaskDetails.user_id;
				this.getSingleUser(userId);
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

	getSingleUser(userId) {
		this.mdTasksService.getOneUser(userId).subscribe(
			singleUser => {
				this.userDetails = singleUser['success'];
				console.log('user Details', this.userDetails);
			},
			error => {
				console.log('error occured', error);
			}
		);
	}

	onDelete() {
		const _title: string = 'Delete MD\'s Task';
		const _description: string = 'Are you sure to permanently delete this MD\'s Task?';
		const _waitDesciption: string = 'Deleting MD\'s Task...';
		const _deleteMessage = `MD\'s Task has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.mdTasksService.deleteMdTask(this.mdTaskId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/strada/md-tasks/md-tasks']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}
}
