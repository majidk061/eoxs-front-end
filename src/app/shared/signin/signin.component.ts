import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { LoginService } from './../services/login.service';
import { SignupComponent } from '../signup/signup.component';
import { AuthService } from '../utils/auth.service';
import { AppRegularExpressionEnum } from '../enums/app-regular-expression.enum';
import { Router } from '@angular/router';

@Component({
	selector: 'app-signin',
	templateUrl: './signin.component.html',
	styleUrls: [ './signin.component.scss' ]
})
export class SigninComponent implements OnInit {
	signInForm: FormGroup;

	constructor(
		public dialogRef: MatDialogRef<SigninComponent>,
		private _formBuilder: FormBuilder,
		private _authService: AuthService,
		private loginService: LoginService,
		private toasterService: ToastrService,
		public dialog: MatDialog,
		public router: Router
	) {
		dialogRef.disableClose = true;
	}

	ngOnInit(): void {
		this.createForm();
	}

	createForm() {
		this.signInForm = this._formBuilder.group({
			email: [ '', [ Validators.required, Validators.pattern(AppRegularExpressionEnum.emailRegex) ] ],
			password: [ '', [ Validators.required ] ]
		});
	}

	signIn() {
		this.signInForm.markAllAsTouched();
		if (this.signInForm.valid) {
			this.loginService
				.login(this.signInForm.get('email').value, this.signInForm.get('password').value)
				.subscribe(
					(res) => {
						let {result} = res
						if(res.status){
							 let obj = {
								email: result.email,
								userName: result.firstName + ' '+result.lastName,
								firstName:result.firstName,
								lastName:result.lastName,
								companyName:result.companyName?result.companyName:'',
								token: result.token
							};
							this._authService.setSessionInfo(obj);
							this.closedialog();
							this.toasterService.success('Signup successful');
						}else{
							this.toasterService.error(res.message);
						}
					},
					(error) => {
						this.toasterService.error('Invalid username or password');
					},
					() => {
						() => {
							setTimeout(
								()=>this.toasterService.clear(),3000
							)
						}
					}
				);
		}
	}

	closedialog() {
		this.dialogRef.close();
	}

	opensignup() {
		this.closedialog();
		this.openDialogSignUp();
	}

	openDialogSignUp(): void {
		const dialogRef = this.dialog.open(SignupComponent, {
			width: '600px',
			height: '95vh',
			data: {}
		});

		dialogRef.afterClosed().subscribe((result) => {
			console.log('The dialog was closed');
		});
	}

	navigateToForgotPasswordPage() {
		this.router.navigate['/steel/forgot-password'];
	}
}
