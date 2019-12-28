// Angular
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
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
	selector: 'kt-create-organization',
	templateUrl: './create-organization.component.html',
	encapsulation: ViewEncapsulation.None
})
export class CreateOrganizationComponent implements OnInit {
	// Public params
	organizationForm: FormGroup;
	loading = false;
	isLoggedIn$: Observable<boolean>;
	errors: any = [];
	userData: any;
	private returnUrl: any;
	private unsubscribe: Subject<any>;
	fSelected;
	fileName;
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
			if (response.status === true && response.data._id) {
				this.router.navigate(['/auth/register']);
			}
		});
		if (localStorage.getItem('orgDetails')) {
			this.router.navigate(['/cdash/dashboard']);
		}
		this.initOrganizationForm();
		this.route.queryParams.subscribe(params => {
			this.returnUrl = params['returnUrl'] || '/';
		});
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initOrganizationForm() {
		this.organizationForm = this.fb.group({
			name: ['', [Validators.required]],
			color: ['', [Validators.required]],
			address: ['', [Validators.required]],
		});
	}

	/**
	 * Form Submit
	 */
	submit() {
		const controls = this.organizationForm.controls;
		/** check form */
		if (this.organizationForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;
		const payload = new FormData();
		payload.append('name', this.organizationForm.get('name').value);
		payload.append('color', this.organizationForm.get('color').value);
		payload.append('address', this.organizationForm.get('address').value);
		if (this.fSelected) {
			payload.append('image', this.fSelected, this.fSelected.name);
		}
		this.auth.createOrganization(payload)
			.subscribe(response => {
				console.log(response);
				const responseData = response['data'];
				if (response.status !== true) {
					localStorage.setItem('userToken', responseData.user_token);
					this.router.navigate(['/cdash/dashboard']);
				} else if (localStorage.getItem('orgDetails')) {
					this.loading = false;
					this.router.navigate(['/cdash/dashboard']);
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
		const control = this.organizationForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}

	onFileChange(event) {
		if (event.target.files.length > 0) {
			const fileSelected: File = event.target.files[0];
			this.fSelected = fileSelected;
			this.fileName = fileSelected.name;
		}
	}
}
