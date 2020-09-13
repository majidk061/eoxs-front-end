import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder,FormGroup, FormControl,Validators} from '@angular/forms';
import { CommonService } from './../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../utils/auth.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  inventory : FormGroup;
  submitted:boolean = false;
  isSupplier:boolean = false;

  constructor(public dialogRef: MatDialogRef<FileUploadComponent>,
    private formBuilder: FormBuilder,
    private CommonService:CommonService,
    private toasterService: ToastrService,
    private _authService: AuthService) { 
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {

    if(this._authService.getSessionInfo()){
      this.isSupplier=true;
    }

    this.inventory = this.formBuilder.group({
      inventoryDocument: new FormControl('',[Validators.required]) 
       
    });
  }

  get f(){
    return this.inventory.controls
  }

  onSubmit(){

    this.submitted = true;
    // stop here if form is invalid
    if (this.inventory.invalid) {
      return;
    }
    const formData = new FormData();
     
    formData.append('inventoryDocument', this.inventory.value.inventoryDocument);
    formData.append('firstName', this._authService.getSessionInfo().firstName);
    formData.append('lastName', this._authService.getSessionInfo().lastName);
    formData.append('email', this._authService.getSessionInfo().email);
    formData.append('companyName', this._authService.getSessionInfo().companyName);
    // let formData = {
    //   firstName:"sdds",
    //   lastName:"sdds",
    //   email:"sdds",
    //   companyName:"sdds",
    //   'inventoryDocument':this.inventory.value.inventoryDocument
    // }
     
    this.CommonService.postMultipart(formData).subscribe(
      (data) => {
        if(data.status){
          
          this.closedialog();
          this.toasterService.success('Inventry Uploaded successfully');
        }else{
          this.toasterService.error(data.message);
        }
      },
      (error) => {
        this.toasterService.error('Upload Failed');
      },
      () => {
        setTimeout(
          ()=>this.toasterService.clear(),3000
        )
      }
    );
     console.log("==form submit ==",this.inventory)
  
  }

  postMethod(files: FileList) {
    this.inventory.patchValue({
      inventoryDocument:files.item(0)
    })
    
  }
  closedialog() {
		this.dialogRef.close();
	}
}
