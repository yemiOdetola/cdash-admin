// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// RxJS
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Auth
import { AuthNoticeService, AuthService } from '../../../../core/auth';

@Component({
	selector: 'kt-input-token',
	templateUrl: './input-token.component.html',
	encapsulation: ViewEncapsulation.None
})
export class InputTokenComponent implements OnInit, OnDestroy {
	// Public params
	resetForm: FormGroup;
	loading = false;
	errors: any = [];
	tokenError = false;

	private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param authService
	 * @param authNoticeService
	 * @param translate
	 * @param router
	 * @param fb
	 * @param cdr
	 */
	constructor(
		private authService: AuthService,
		public authNoticeService: AuthNoticeService,
		private router: Router,
		private fb: FormBuilder,
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.initResetForm();
		this.resetForm.value.token = '';
		this.resetForm.value.password = '';
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initResetForm() {
		this.resetForm = this.fb.group({
			token: ['', Validators.required],
			password: ['', Validators.required]
		});
	}

	/**
	 * Form Submit
	 */
	submit() {
		const controls = this.resetForm.controls;
		/** check form */
		if (this.resetForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		const password = controls['password'].value;
		const token = controls['token'].value;
		const successMsg = 'Authentication Successfull';
		const errorMsg = 'Some error Occured, Please retry.';
		const email = localStorage.getItem('tokenEmail');
		let payload = {
			email: email,
			password: password,
			token: token
		};
		this.authService.confirmTokenLogin(payload).subscribe(
			response => {
				if (response['success']) {
					this.authNoticeService.setNotice(successMsg, 'success');
					this.router.navigateByUrl('/auth/login');
					this.loading = false;
				} else  {
					this.authNoticeService.setNotice(errorMsg, 'danger');
					this.loading = false;
				}
			},
			error => {
				this.authNoticeService.setNotice(errorMsg, 'danger');
			}
		);
		// this.authService.confirmTokenLogin(payload).pipe(
		// 	tap(response => {
		// 		if (response) {
		// 			this.authNoticeService.setNotice(successMsg, 'success');
		// 			this.router.navigateByUrl('/auth/login');
		// 		} else {
		// 			this.authNoticeService.setNotice(errorMsg, 'danger');
		// 		}
		// 	}),
		// 	takeUntil(this.unsubscribe),
		// 	finalize(() => {
		// 		this.loading = false;
		// 		this.cdr.markForCheck();
		// 	})
		// ).subscribe();
	}
}
