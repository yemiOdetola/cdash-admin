// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
// Store
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
// Auth
import { AuthNoticeService, AuthService, Login } from '../../../../core/auth';

@Component({
	selector: 'kt-activate',
	templateUrl: './activate.component.html',
	encapsulation: ViewEncapsulation.None
})
export class ActivateComponent implements OnInit, OnDestroy {
	// Public params
	activationForm: FormGroup;
	loading = false;
	isLoggedIn$: Observable<boolean>;
	errors: any = [];
	userData: any;
	private returnUrl: any;
	private unsubscribe: Subject<any>;
	constructor(
		private router: Router,
		private auth: AuthService,
		private authNoticeService: AuthNoticeService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private route: ActivatedRoute
	) { }

	ngOnInit(): void {
		this.auth.checkOrganization().subscribe(response => {
			if (response.status === true && response.data.activated === true) {
				localStorage.setItem('orgDetails', response.data.data);
				localStorage.setItem('activated', 'true');
				this.router.navigate(['/auth/create-organization']);
			}
		});

		// this.auth.checkOrganization().subscribe(response => {
		// 	if (response.status !== false) {
		// 		localStorage.setItem('activated', 'true');
		// 		localStorage.setItem('orgDetails', response.data.data);
		// 		this.router.navigate(['/cdash/dashboard']);
		// 	} else {
		// 		this.router.navigate(['/auth/create-organization']);
		// 	}
		// });
		this.initActivationForm();
		this.route.queryParams.subscribe(params => {
			this.returnUrl = params['returnUrl'] || '/';
		});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initActivationForm() {
		this.activationForm = this.fb.group({
			key: ['', [Validators.required]
			]
		});
	}

	/**
	 * Form Submit
	 */
	submit() {
		const controls = this.activationForm.controls;
		/** check form */
		if (this.activationForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;
		const activationData = {
			key: controls['key'].value
		};
		this.auth
			.activate(activationData)
			.subscribe(response => {
				console.log(response);
				const responseData = response['data'];
				if (response.status === true) {
					localStorage.setItem('activated', 'true');
					this.router.navigate(['/auth/create-organization']);
				} else {
					this.authNoticeService.setNotice('Wrong activation code', 'danger');
					this.loading = false;
				}
			});
	}

	// togettingtoken


	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.activationForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
