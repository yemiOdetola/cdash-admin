// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { ComputationsService } from '../../../../../core/computations';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { MatDialog } from '@angular/material';
import { tap, map } from 'rxjs/operators';

@Component({
	selector: 'kt-score-edit',
	templateUrl: './score-edit.component.html',
	styleUrls: ['./score-edit.component.scss']
})
export class ScoreEditComponent implements OnInit, OnDestroy {
	score: any;
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	scoreForm: FormGroup;
	hasFormErrors: boolean = false;
	headerMargin: number;
	selectedTab: number = 0;
	idParams: string;
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private fb: FormBuilder,
		private computationsService: ComputationsService
	) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.initScoreForm();
		if (this.activatedRoute.snapshot.params['id']) {
			console.log('id found', this.activatedRoute.snapshot.params['id']);
			this.idParams = this.activatedRoute.snapshot.params['id'];
		}
		if (this.idParams) {
			this.getMaturityScoreDetails().subscribe(scoreData => this.editScoreForm(scoreData));
			this.loadingSubject.next(true);
			this.editScoreForm();
		} else {
			this.score = this.scoreForm.value;
			this.loadingSubject.next(false);
		}
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
	}
	// contact
	getMaturityScoreDetails() {
		return this.computationsService.getScoreById(this.idParams).pipe(
			map(scoreDetails => {
				this.score = scoreDetails['data'];
				this.loadingSubject.next(false);
				return this.score;
			})
		);
	}

	editScoreForm(score: any = {}) {
		this.scoreForm = this.fb.group({
			parameter: [score.parameter || '', Validators.required],
			score: [score.score || '', Validators.required]
		});
	}

	initScoreForm() {
		this.scoreForm = this.fb.group({
			parameter: ['', Validators.required],
			score: ['', Validators.required]
		});
	}

	getComponentTitle() {
		let result = 'Please Wait';
		if (this.score) {
			result = `Edit Score`;
			return result;
		} else {
			return result = 'Add new score';
		}
		return result;
	}

	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.scoreForm.controls;
		this.loadingSubject.next(true);
		/** check form */
		if (this.scoreForm.invalid) {
			this.loadingSubject.next(false);
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.score._id) {
			console.log('MdTask has an Id');
			let editedMdTask = this.scoreForm.value;
			this.updateScore(editedMdTask);
			return;
		}
		this.addScore(this.scoreForm.value);
	}

	addScore(score) {
		this.computationsService.createScore(score).subscribe(
			data => {
				this.loadingSubject.next(false);
				const message = `Maturity score been Successfully created`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/cdash/computations/maturity-scores']);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}

	updateScore(score) {
		this.computationsService.updateScore(score, this.score._id).subscribe(
			data => {
				this.loadingSubject.next(false);
				const message = `Maturity score been Successfully Updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
				this.router.navigate(['/cdash/computations/maturity-scores']);
			},
			error => {
				this.loadingSubject.next(false);
				console.log('Error response', error);
				const title = 'Please Retry';
				const message = 'Sorry, Temporary Error Occured';
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, true);
			});
	}


	reset() {
		this.initScoreForm();
		this.hasFormErrors = false;
		this.scoreForm.markAsPristine();
		this.scoreForm.markAsUntouched();
		this.scoreForm.updateValueAndValidity();
	}

	/**
	 * Close alert
	 *
	 * @param $event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	ngOnDestroy() { }

}
