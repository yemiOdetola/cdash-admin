// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
// Services and Models
import { ComputationsService } from '../../../../../core/computations';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-maturity-score-list',
	templateUrl: './maturity-score-list.component.html',
	styleUrls: ['./maturity-score-list.component.scss']
})
export class MaturityScoreListComponent implements OnInit, OnDestroy {
	loading$: Observable<boolean>;
	loadingSubject = new BehaviorSubject<boolean>(true);
	maturityScores: any[];
	pageIndex = 0;
	limit = 10;
	resultsLength: number = 0;
	disablePrev = true;
	disableNext: boolean;
	constructor(private computationsService: ComputationsService, private layoutUtilsService: LayoutUtilsService) { }

	ngOnInit() {
		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.computationsService.countMaturityList().subscribe(
			countResult => {
				this.resultsLength = countResult['data'];
				this.loadingSubject.next(false);
				if (this.resultsLength <= 10) {
					console.log('not up to 10', this.resultsLength);
					this.disableNext = true;
				} else {
					console.log('up to 10', this.resultsLength);
					this.disableNext = false;
				}
			}
		);
		let skip = this.pageIndex * this.limit;
		this.getMaturities(skip, this.limit);
	}

	getMaturities(skip, limit) {
		this.loadingSubject.next(true);
		this.computationsService.getMaturityList(skip, limit).subscribe(
			responseData => {
				this.maturityScores = responseData['data'];
				this.loadingSubject.next(false);
				console.log('all maturityScores returned', this.maturityScores);
			},
			error => {
				console.log('error', error);
			});
	}
	countMaturities() {
		this.loadingSubject.next(true);
		this.computationsService.countMaturityList().subscribe(
			countResult => {
				this.resultsLength = countResult['data'];
				if (this.pageIndex > 0) {
					this.disablePrev = false;
				}
				this.loadingSubject.next(false);
			}
		);
	}


	onDelete(id) {
		const _title: string = 'Delete score';
		const _description: string = 'Are you sure to permanently delete this score?';
		const _waitDesciption: string = 'Deleting score';
		const _deleteMessage = `Score has been deleted`;
		const _errorDelete = 'Seems and Error Occured, Retry';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
			if (!res) {
				return;
			}
			this.computationsService.deleteScore(id).subscribe(
				deleted => {
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					let skip = this.pageIndex * this.limit;
					this.getMaturities(skip, this.limit);
					this.countMaturities();
				},
				error => {
					console.log('error', error);
					this.layoutUtilsService.showActionNotification(_errorDelete, MessageType.Delete);
				}
			);
		});
	}

	itemNav() {
		if (((this.pageIndex * 10) + 10) >= this.resultsLength) {
			this.disableNext = true;
			console.log('paste total numbers');
			// return;
		} else {
			this.disableNext = false;
		}
		if (this.pageIndex === 0) {
			this.disablePrev = true;
			console.log('last page');
			// return;
		} else {
			this.disablePrev = false;
		}
	}
	getNext() {
		this.pageIndex = this.pageIndex + 1;
		let skip = this.pageIndex * this.limit;
		this.getMaturities(skip, this.limit);
		this.countMaturities();
		this.itemNav();
	}

	getPrev() {
		this.pageIndex = this.pageIndex - 1;
		let skip = this.pageIndex * this.limit;
		this.getMaturities(skip, this.limit);
		this.countMaturities();
		this.itemNav();
	}

	ngOnDestroy() { }

}
