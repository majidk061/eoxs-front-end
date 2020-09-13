import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { AppRegularExpressionEnum } from '../enums/app-regular-expression.enum';
import { LoginService } from './../services/login.service';
import { SigninComponent } from '../signin/signin.component';
import { AuthService } from '../utils/auth.service';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: [ './signup.component.scss' ]
})
export class SignupComponent implements OnInit {
	signUpForm: FormGroup;

	constructor(
		public dialogRef: MatDialogRef<SignupComponent>,
		public dialog: MatDialog,
		private _formBuilder: FormBuilder,
		private loginService: LoginService,
		private _authService: AuthService,
		private toasterService: ToastrService
	) {
		dialogRef.disableClose = true;
	}

	ngOnInit(): void {
		this.createForm();
	}

	createForm() {
		this.signUpForm = this._formBuilder.group({
			firstName: [ '', [ Validators.required ] ],
			lastName: [ '' ],
			email: [ '', [ Validators.required, Validators.pattern(AppRegularExpressionEnum.emailRegex) ] ],
			phoneNumber: [ '', [ Validators.required ] ],
			accountType: [ '', [ Validators.required ] ],
			companyName: [ '', [ Validators.required ] ],
			password: [ '', [ Validators.required ] ],
			confirmPassword: ['', [Validators.required]]
		});
	}

	signUp() {
		this.signUpForm.markAllAsTouched();
		if (this.signUpForm.valid && this.signUpForm.get('password').value == this.signUpForm.get('confirmPassword').value) {
			this.loginService
				.signup(
					this.signUpForm.get('firstName').value,
					this.signUpForm.get('password').value,
					this.signUpForm.get('email').value,
					this.signUpForm.get('firstName').value,
					this.signUpForm.get('lastName').value,
					this.signUpForm.get('phoneNumber').value,
					this.signUpForm.get('accountType').value,
					this.signUpForm.get('companyName').value
				)
				.subscribe(
					(data) => {
						if(data.status){

						this.loginService
							.login(this.signUpForm.get('email').value, this.signUpForm.get('password').value)
							.subscribe((res) => {
								let {result} = res
								if(res.status){
									this.signUpForm.reset();
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
								console.log("result========>",result)
								
							});
						}else{
							this.toasterService.error(data.message);
						}	
					},
					(error) => {
						this.toasterService.error('Signup failed');
					},
					() => {
						setTimeout(
							()=>this.toasterService.clear(),3000
						)
					}
				);
		}
	}

	closedialog() {
		this.dialogRef.close();
	}

	isControlIsInValid(controlName: string) {
		if (this.signUpForm.get(controlName).touched && this.signUpForm.get(controlName).invalid) {
			return true;
		} else {
			return false;
		}
	}

	isConfirmPasswordValid(): boolean {
		if(this.signUpForm.get('password').value) {
			if(this.signUpForm.get('password').value == this.signUpForm.get('confirmPassword').value) {
				return true;
			}
			else {
				return false;
			}
		}
		else {
			return true;
		}
	}

	openDialogSignIn(): void {
		const dialogRef = this.dialog.open(SigninComponent, {
			width: '600px',
			height: '95vh',
			data: {}
		});

		dialogRef.afterClosed().subscribe((result) => {
			console.log('The dialog was closed');
		});
	}

	opensignin() {
		this.closedialog();
		this.openDialogSignIn();
	}
}
