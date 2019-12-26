import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {
	constructor(public router: Router) { }
	canActivate(): boolean {
		let loginDetails = JSON.parse(localStorage.getItem('loginData'));
		if (loginDetails.head !== true && loginDetails.admin !== true) {
			this.router.navigate(['cdash/dashboard']);
			return false;
		}
		return true;
	}
}
