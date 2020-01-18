import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class LogsGuardService implements CanActivate {
	constructor(public router: Router) { }
	canActivate(): boolean {
		let roles = localStorage.getItem('roles');
		console.log(roles);
		let userDetails;
		if (localStorage.getItem('userDetails')) {
			userDetails = JSON.parse(localStorage.getItem('userDetails'))
		}
		if (roles) {
			let rolesArr = roles.split(',');
			console.log('allem', rolesArr);
			for (let i = 0; i < rolesArr.length; i++) {
				console.log('each', rolesArr[i]);
				if (rolesArr[i] === 'edit') {
					return true;
				}
			}
		} else if (userDetails.type.toString() === 'superadmin') {
			return true;
		}
		console.log('does not');
		this.router.navigate(['cdash/dashboard']);
		return false;
	}
}
