import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectModel, ProjectsService } from '../../../../../core/projects';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-project',
	templateUrl: './project.component.html',
	styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	proceedingOption: string;
	projectId: string;
	projectDetails: any;
	commentForm: FormGroup;
	projectUserForm: FormGroup;
	projectVendorForm: FormGroup;
	pageTitle = 'Please wait...';
	attendants = [];
	projectVendors = [];
	hasFormErrors = false;
	comments = [];
	POcolumns: any = ['Purchase ID', 'Subject', 'Body', 'Shipping Address'];
	poList;
	dataSourcePO: any;
	toggUser;
	toggVendor;
	toggComment;
	users = [];
	vendors = [];
	activeTab = 'users';
	userFormDisplay = false;
	vendorFormDisplay = false;
	constructor(
		private route: ActivatedRoute,
		private projectsService: ProjectsService,
		private layoutUtilsService: LayoutUtilsService,
		private _location: Location,
		private router: Router,
		private fb: FormBuilder, ) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.projectId = this.route.snapshot.params['id'];
		this.getPurchaseOrders(this.projectId);
		this.getUsers();
		this.getVendors();
		this.initAddVendorForm();
		this.initProjectUserForm();
		this.initCommentForm();
		this.getProjectAttenders();
		this.getProjectVendors();
		this.getProjectComments();
		this.projectsService.getProjectById(this.projectId).subscribe(
			singleLink => {
				this.projectDetails = singleLink['success'];
				console.log('this project details oninit', this.projectDetails);
				this.loadingSubject.next(false);
				this.pageTitle = `Project Details`;
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

	onDelete() {
		const _title: string = 'Delete project';
		const _description: string = 'Are you sure to permanently delete this project?';
		const _waitDesciption: string = 'Deleting project';
		const _deleteMessage = `project has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.projectsService.deleteProject(this.projectId).subscribe(
				deleted => {
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigate(['/strada/projects/projects']);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}

	activateTab(tab) {
		if (this.activeTab !== tab) {
			this.activeTab = tab;
			return;
		}
	}

	showNewUserForm() {
		this.userFormDisplay = !this.userFormDisplay;
	}

	showNewVendorForm() {
		this.vendorFormDisplay = !this.vendorFormDisplay;
	}

	getUsers() {
		this.projectsService.getUsers().subscribe(
			myusers => {
				this.users = myusers['success'];
				this.loadingSubject.next(false);
				console.log('users', this.users);
			}
		);
	}
	getVendors() {
		this.projectsService.getVendors().subscribe(
			myvendors => {
				this.vendors = myvendors['success'];
				console.log('vendors', this.vendors);
				this.loadingSubject.next(false);
			}
		);
	}
	getProjectVendors() {
		this.projectsService.getProjectVendors(this.projectId).subscribe(
			projectVendors => {
				this.projectVendors = projectVendors['success'];
			},
			error => {
				console.log('error occured', error);
			}
		);
	}
	initCommentForm() {
		this.commentForm = this.fb.group({
			comment: ['', Validators.required]
		});
	}

	initProjectUserForm() {
		this.projectUserForm = this.fb.group({
			user: ['', Validators.required]
		});
	}
	initAddVendorForm(project: any = {}) {
		this.projectVendorForm = this.fb.group({
			vendor: ['', Validators.required]
		});
	}
	getProjectAttenders() {
		this.projectsService.getProjectUsers(this.projectId).subscribe(
			projectUsers => {
				this.attendants = projectUsers['success'];
			},
			error => {
				console.log('error occured', error);
			}
		);
	}

	deleteUser(attender) {
		const _title: string = 'Remove User from Project';
		const _description: string = 'Are you sure to remove this User?';
		const _waitDesciption: string = 'Removing User';
		const _deleteMessage = `User has been Removed`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.projectsService.deleteUserFromProject(attender._id).subscribe(
				deleted => {
					this.loadingSubject.next(true);
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.getProjectAttenders();
					this.loadingSubject.next(false);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
					this.loadingSubject.next(false);
				}
			);
		});
	}

	deleteVendor(vendor) {
		const _title: string = 'Remove Vendor from Project';
		const _description: string = 'Are you sure to remove this Vendor?';
		const _waitDesciption: string = 'Removing Vendor';
		const _deleteMessage = `Vendor has been Removed`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.projectsService.deleteVendorFromProject(vendor._id).subscribe(
				deleted => {
					this.loadingSubject.next(true);
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.getProjectVendors();
					this.loadingSubject.next(false);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
					this.loadingSubject.next(false);
				}
			);
		});
	}

	addComment() {
		this.loadingSubject.next(true);
		if (this.commentForm.invalid) {
			this.hasFormErrors = true;
			return;
		}
		let payload = {};
		this.loadingSubject.next(true);
		const project_id = this.projectId;
		const comment = this.commentForm.value.comment;
		payload = { ...payload, project_id, comment };
		console.log(payload);
		this.projectsService.addCommentToProject(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `Successfully Added`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate([`/strada/projects/project/${this.projectId}`]);
				this.getProjectComments();
			}, error => {
				if (error.error.error === 'Error: Duplicate Project User') {
					this.layoutUtilsService.showActionNotification('This Vendor has already been added!', MessageType.Create, 10000, true, true);
				}
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	getProjectComments() {
		this.projectsService.getProjectComments(this.projectId).subscribe(
			projectComments => {
				this.comments = projectComments['success'];
			},
			error => {
				console.log('error occured', error);
			}
		);
	}

	deleteComment(comment) {
		const _title: string = 'Remove Comment from Project';
		const _description: string = 'Are you sure to remove this Comment?';
		const _waitDesciption: string = 'Removing Comment';
		const _deleteMessage = `Comment has been Removed`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.projectsService.deleteCommentFromProject(comment._id).subscribe(
				deleted => {
					this.loadingSubject.next(true);
					console.log('deleted', deleted);
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.getProjectComments();
					this.loadingSubject.next(false);
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
					this.loadingSubject.next(false);
				}
			);
		});
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	getPurchaseOrders(projectId) {
		this.projectsService.getPOs(projectId).subscribe(
			salesPO => {
				this.poList = salesPO['success'];
				this.dataSourcePO = new MatTableDataSource<any>(this.poList);
				console.log('PO list PO list', salesPO);
				this.loadingSubject.next(false);
			},
			error => {
				const message = 'Sorry, Could not retrieve Purchase Orders';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				console.log('error occured', error);
				this.loadingSubject.next(false);
			}
		);
	}

	addUser() {
		let _project = this.projectUserForm.value;
		this.loadingSubject.next(true);
		let payload = {};
		const project_id = this.projectId;
		const name = _project.user;
		let user_id = '';
		this.users.forEach(user => {
			if (user.name === _project.user) {
				user_id = user._id;
			}
		});
		payload = { ...payload, project_id, user_id, name };
		console.log(payload);
		this.projectsService.addUserToProject(payload).subscribe(
			data => {
				this.loadingSubject.next(false);
				console.log('success reponse', data);
				const message = `Successfully Added`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.getUsers();
				// this.router.navigate([`/strada/projects/project/${this.idParams}`]);
			}, error => {
				console.log('error.error', error.error['error']);
				if (error.error['error'] === 'Error: Duplicate Project User') {
					this.layoutUtilsService.showActionNotification('This User has already been added!', MessageType.Create, 10000, true, true);
				} else {
					this.loadingSubject.next(false);
					console.log('Error response', error);
					const title = 'Please Retry';
					const message = 'Sorry, Temporary Error Occured';
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				}
			});
	}


	toggleUser() {
		this.toggUser = !this.toggUser;
		this.toggComment = false;
		this.toggVendor = false;
	}
	toggleVendor() {
		this.toggVendor = !this.toggVendor;
		this.toggComment = false;
		this.toggUser = false;
	}
	toggleComment() {
		this.toggComment = !this.toggComment;
		this.toggUser = false;
		this.toggVendor = false;
	}
}
