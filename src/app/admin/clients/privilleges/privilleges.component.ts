import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { CategoryFormService } from '../../../services/categories/category-form.service';
import { ToastsManager } from 'ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
import { UtilsService } from '../../../services/utils.service';

export class PrivillagesModel {
  constructor(
    public privillage: string,
    public updated_by: number,
    public id?: number) {
  }
}
export class PrivillagesFormModel {
  constructor(
    public privillage: string,
    public updated_by: number,
  ) {

  }
}

@Component({
  selector: 'app-privilleges',
  templateUrl: './privilleges.component.html',
  styleUrls: ['./privilleges.component.css']
})
export class PrivillegesComponent implements OnInit {

  @Input() event: PrivillagesModel;
  privillegeForm: FormGroup;
  isEdit: boolean;
  formEvent: PrivillagesFormModel;
  formErrors: any;
  formChangeSub: Subscription;
  submitEventObj: PrivillagesModel;
  submitting: boolean;
  submitEventSub: Subscription;
  error: boolean;
  submitBtnText: string;
  routeSub: Subscription;
  privillagesub:Subscription;
  private id: number;
  privillage:any;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public toastr: ToastsManager,
    private _userapi: UserService,
    public utils: UtilsService,
    private breadcrumbsService: BreadcrumbsService,
  ) {
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
      
      });
    this.privillegeForm = new FormGroup({
      userId: new FormControl(this.id),
      Revsurvey: new FormControl(),
      RevAccess: new FormControl()

    });
  }

  ngOnInit() {


        /*BreadCrumb*/
        let bcList = [{ label: 'Home', url: 'home', params: [] }, { label: 'Clients', url: 'clients', params: [] },
        { label: 'Privillages', url: 'Privillages', params: [] }];
        this.utils.changeBreadCrumb(bcList);
        this.utils.currentBSource.subscribe(list => {
          this.breadcrumbsService.store(list);
        });
        /*End - BreadCrumb*/
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Save';
    this.privillagesub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
        //this._getPrivillages();
      });
    //this._getPrivillages();
  }


  // private _getPrivillages() {    
  //   this.privillagesub= this._userapi
  //     .getPrivillageById$(this.id)
  //     .subscribe(
  //       response =>  {

  //         for(let i=0;i<response.data.length;i++){
  //           this.privillegeForm.controls[response.data[i].privillege].setValue(1);
  //         }
          
  //         if(response.success){
  //           this.privillage= response.data;                  
  //         }          
         
  //       },
  //       err => {
        
  //         this.error = true;
  //       }
  //     );
  // }




  resetForm() {
    this.privillegeForm.reset();
  }

  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    if (res.success) {
      this.toastr.success(res.message, 'Success');
    }
    else {
      this.toastr.error(res.message, 'Invalid');
    }
  }

  private _handleSubmitError(err) {
    this.toastr.error(err.message, 'Error');
    this.submitting = false;
    this.error = true;
  }
  savePrivillege() {
    this.submitting = true;
    // if (!this.isEdit) {
    //   this.submitEventSub = this._userapi
    //     .postEvents$(this.privillegeForm.value)
    //     .subscribe(
    //       data => this._handleSubmitSuccess(data),
    //       err => this._handleSubmitError(err)
    //     );
    // }
    // else {
    //   this.submitEventSub = this._userapi
    //     .editEvent$(this.event.id, this.privillegeForm.value)
    //     .subscribe(
    //       data => this._handleSubmitSuccess(data),
    //       err => this._handleSubmitError(err)
    //     );
    // }

  }



}

