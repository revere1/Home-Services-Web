import { Component, OnInit, Input, ViewChild, OnDestroy, Output, NgModule, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { ProductFormService } from '../../../services/products/product-form.service';
import { ProductService } from '../../../services/product.service';
import { ProductModel, FormProductModel } from '../../../models/product.model';
import { Subscription } from 'rxjs/Subscription';
import { CategoriesService } from '../../../services/categories.service';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ENV } from '../../../env.config';
import { SubcategoriesService } from '../../../services/subcategories.service';
import { UtilsService } from '../../../services/utils.service';
declare var $: any;

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  @Input() event: ProductModel;
  @ViewChild('fileInput') fileInput;
  isEdit: boolean;
  productForm: FormGroup;
  public serverURL = ENV.SERVER_URL
  apiEvents = [];
  products = [];
  formEvent: FormProductModel;
  formErrors: any;
  formChangeSub: Subscription;
  submitEventObj: ProductModel;
  submitting: boolean;
  submitEventSub: Subscription;
  error: boolean;
  productsData: any;
  submitBtnText: string;
  categories: Object[];
  subcategories: Object[];
  uploadFilesObj = {};
  uploadFiles = [];
  product_img: any;
  routeSub: Subscription;
  public id: number;
  canRemove: boolean = true;
  finished: boolean = false;
  public config: DropzoneConfigInterface = {};
  public totalsize: number = 0.0;
  private tryingToPaste = false;

  constructor(private fb: FormBuilder,
    private router: Router,
    public cf: ProductFormService,
    private _productapi: ProductService,
    private utils: UtilsService,
    private route: ActivatedRoute,
    private _categoryService: CategoriesService,
    private _subcategoriesService: SubcategoriesService,
    public toastr: ToastsManager
  ) { }
  pasteImg() {
    let that = this;
    that.utils.isPastedEvent(".note-editable", paste => {
      if (!paste) that.tryingToPaste = true;
    });
    $('.note-editable').bind('paste', null, function () {
      that.tryingToPaste = true;
    });
  }
  ngOnInit() {
    {
      let _that = this;
      $(document).ready(() => {
        $('#product_description').summernote({
          toolbar: ENV.SUMMER_SETUP.toolbar,
          buttons: {
            save: this.SaveButton(_that)
          },
          callbacks: {
            onPaste: function (e) {
              _that.tryingToPaste = true;
            },
            onImageUpload: function (files) {
              if (_that.tryingToPaste) {
                _that.tryingToPaste = false;
                return false;
              }
              else
                _that.uploadFile(files, this);
            },
            onCreateLink: function (originalLink) {
              return originalLink; // return original link 
            },
            hint: _that.utils.hint()
          }
        });

        // $('#summary').summernote({
        //   toolbar: ENV.SUMMER_SETUP.toolbar,
        //   buttons: {
        //     save: this.SaveButton(_that)
        //   },
        //   callbacks: {
        //     onPaste: function (e) {
        //       _that.tryingToPaste = true;
        //     },
        //     onImageUpload: function (files) {
        //       if (_that.tryingToPaste) {
        //         _that.tryingToPaste = false;
        //         return false;
        //       }
        //       else
        //         _that.uploadFile(files, this);
        //     }
        //   },
        //   onCreateLink: function (originalLink) {
        //     return originalLink; // return original link 
        //   },
        //   hint: _that.utils.hint()
        // });
        //this.pasteImg();
      });
    }
    this.routeSub = this.route.params
    .subscribe(params => {
      this.id = params['id'];
    });
    if (this.event && this.event['product_img'] !== undefined) {
      this.product_img = this.event['product_img'];
    }
 
    let apiEvent = this._productapi.getComposeById$(this.id).subscribe(data =>  {
      if (data.success === false) {
      }
      else {
        this.finished = true;
        this.productsData = data.data;
        this.product_img = (this.productsData.product_img) ? ENV.SERVER_URL + this.productsData.product_img : null;   
        // this.productsData.product_attachements.forEach(ele => {
        //   this.totalsize += parseFloat(ele.fsize);
        // });
      }
      });

    this.formErrors = this.cf.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Create';
    this.formEvent = this._setFormEvent();
    this._buildForm();
    let that = this;
    this.config = {
      url: ENV.BASE_API + 'products/path?token=' + this._productapi.getToken(),
      maxFiles: ENV.PRODUCT_MAX_FILES,
      maxFilesize: ENV.HELP_MAX_SIZE,
      clickable: true,
      createImageThumbnails: true,
      addRemoveLinks: true,
      init: function () {
        let drop = this;
        this.on("addedfile", function (file) {
          that.totalsize += parseFloat((file.size / (1000 * 1000)).toFixed(2));
        });
        this.on('removedfile', function (file) {
          /*If reupload already existed file, don t delet the file if max lik=mit crossed error uploaded*/
          if (file.status === 'error') {
            let index = (that.uploadFiles).indexOf(that.uploadFilesObj[file.upload.uuid]);
            if (index > -1) {
              return false;
            }
          }
          /*end*/
          if (that.canRemove) {

            that.totalsize -= parseFloat((file.size / (1000 * 1000)).toFixed(2));
            //Removing values from array which are existing in uploadFiles variable         
            let index = (that.uploadFiles).indexOf(that.uploadFilesObj[file.upload.uuid]);
            if (index > -1) {
              if (that.uploadFiles.length === ENV.PRODUCT_MAX_FILES) {
                that.formErrors['files'] = '';
                that._setErrMsgs(that.productForm.get('files'), that.formErrors, 'files');
              }
              (that.uploadFiles).splice(index, 1);
              that.removeFile(that.uploadFilesObj[file.upload.uuid]);
              delete that.uploadFilesObj[file.upload.uuid];
            }
          }
        });
        this.on('error', function (file, errorMessage) {
          drop.removeFile(file);
        });
        this.on('success', function (file) {
        });
      },
      /* Check for total all files size*/
      accept: function (file, done) {
        if (that.totalsize <= ENV.HELP_MAX_SIZE) {
          done();
        } else {
          done('Total size exceeded');
        }
      }
    };
    this._buildForm();
    this._categoryService.getCategory$().subscribe(data => {
      if (data.success === false) {
      } else {
        this.categories = data.data;
      }
    });
    //Fetch Countries
    this._subcategoriesService.getSubcategories$().subscribe(data => {
      if (data.success === false) {
      } else {
        this.subcategories = data.data;
      }
    });

  }

  public onUploadSuccess(eve) {
    if ((eve[1].success !== undefined) && eve[1].success) {
      this.formErrors['files'] = '';
      Object.assign(this.uploadFilesObj, { [eve[0].upload.uuid]: eve[1].data });
      (this.uploadFiles).push(eve[1].data);
    }
    else {
      this.formErrors['files'] = 'Something Went Wrong';
    }
    this._setErrMsgs(this.productForm.get('files'), this.formErrors, 'files');
  };
  public onUploadError(eve) {
    this.formErrors['files'] = eve[1];
    this._setErrMsgs(this.productForm.get('files'), this.formErrors, 'files');
  };

  private _buildForm() {
    let validRules = {
      product_name: [this.formEvent.product_name, [
        Validators.required
      ]],
      product_code:  [this.formEvent.product_code, [
        Validators.required
      ]],
      category: [this.formEvent.category_id,
      Validators.required
      ],
      subcategory: [this.formEvent.subcategory_id],
      product_description: [this.formEvent.product_description, [
      ]],
      cost: [this.formEvent.cost, Validators.pattern["0-9*"]],
      offer_price: [this.formEvent.offer_price, Validators.pattern["0-9*"]],
      delivery_days: [this.formEvent.delivery_days, Validators.pattern["0-9*"]],
      quantity: [this.formEvent.quantity, Validators.pattern["0-9*"]],
      status: [this.formEvent.status, [
        Validators.required
      ]]
    };
    this.productForm = this.fb.group(validRules);

    // Subscribe to form value changes
    this.formChangeSub = this.productForm
      .valueChanges
      .subscribe(data => this._onValueChanged());
    // If edit: mark fields dirty to trigger immediate
    // validation in case editing an event that is no
    // longer valid (for example, an event in the past)
    if (this.isEdit) {
      const _markDirty = group => {
        for (const i in group.controls) {
          if (group.controls.hasOwnProperty(i)) {
            group.controls[i].markAsDirty();
          }
        }
      };
      _markDirty(this.productForm);
    }
    this._onValueChanged();
  }
  private _onValueChanged() {
    if (!this.productForm) { return; }
    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        this._setErrMsgs(this.productForm.get(field), this.formErrors, field);
      }
    }
  }
  _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
    if (control && control.dirty && control.invalid) {
      const messages = this.cf.validationMessages[field];
      for (const key in control.errors) {
        if (control.errors.hasOwnProperty(key)) {
          errorsObj[field] += messages[key] + '<br>';
        }
      }
    }
  };


  private removeFile(file) {
    let apiEvent = this._productapi.removeFile(file).subscribe(
      data => {
        this._handleSubmitSuccess(data);
      },
      err => this._handleSubmitError(err)
    );
    (this.apiEvents).push(apiEvent);
  }
  
  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new FormProductModel(null,null, null, null,null,null,null,null,null,null,[]);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data

      return new FormProductModel(
        this.event.product_name,
        this.event.product_code,
        this.event.category_id,
        this.event.subcategory_id,
        this.event.product_description,
        this.event.cost,
        this.event.offer_price,
        this.event.delivery_days,
        this.event.quantity,
        this.event.status,
        this.event.files,
        
      
      );
    }
  }

  private _getSubmitObj() {
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);

    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new ProductModel(
      this.productForm.get('product_name').value,
      this.productForm.get('product_code').value,
      this.productForm.get('category').value,
      this.productForm.get('subcategory').value,
      $('#product_description').summernote('code'),
      this.productForm.get('cost').value,
      this.productForm.get('offer_price').value,
      this.productForm.get('delivery_days').value,
      this.productForm.get('quantity').value,
      this.productForm.get('status').value,
      this.event ? this.event.files : this.uploadFiles,
      this.event ? this.event.id : null,
    );
  }

  saveProduct() {
    if ($('#product_description').summernote('isEmpty')) {
      this.formErrors['product_description'] = this.cf.validationMessages['product_description'].required;
      this._setErrMsgs(this.productForm.get('product_description'), this.formErrors, 'product_description');
      return false;
    }
    else {
      this.formErrors['summary'] = '';
      this._setErrMsgs(this.productForm.get('product_description'), this.formErrors, 'product_description');
    }

    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();
    console.log(this.submitEventObj);
    let fileBrowser = this.fileInput.nativeElement;
    let formData = new FormData();
    if (fileBrowser.files && fileBrowser.files[0]) {
      formData.append("product_img", this.fileInput.nativeElement.files[0], this.fileInput.nativeElement.files[0].name);
    }
    for (let k in this.submitEventObj) {
      formData.append(k, this.submitEventObj[k]);
    }
    if (!this.isEdit) {
      let apiEvent = this.submitEventSub = this._productapi
        .postEvent$(this.submitEventObj)
        .subscribe(
          data => {
            this._handleSubmitSuccess(data);
            this.canRemove = false;
            //this.router.navigate(['/analyst/help']);
          },
          err => this._handleSubmitError(err)
        );
      (this.apiEvents).push(apiEvent);
    } else {
      this.submitting = true;
      this.submitEventObj = this._getSubmitObj();
      let fileBrowser = this.fileInput.nativeElement;
      let formData = new FormData();
      if (fileBrowser.files && fileBrowser.files[0]) {
        formData.append("product_img", this.fileInput.nativeElement.files[0], this.fileInput.nativeElement.files[0].name);
      }
      for (let k in this.submitEventObj) {
        formData.append(k, this.submitEventObj[k]);
      }
      console.log(this.submitEventObj)
      this.submitEventSub = this._productapi
     
        .editEvent$(this.event.id, formData)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    }
  }

  deleteProductAttachment(id: number, fsize: number) {
    var delmsg = confirm("Are u Sure Want to delete?");
    if (delmsg) {
      let apiEvent = this._productapi.deleteProductAttachmentById$(id)
        .subscribe(
          data => {
            this._handleSubmitSuccess1(data, id);
          },
          err => this._handleSubmitError(err)
        );
      (this.apiEvents).push(apiEvent);
      //this.totalsize = this.totalsize - fsize;
    }

  }

  private _handleSubmitSuccess1(res, id = 0) {
    this.error = false;
    // Redirect to event detail
    if (res.success) {
      this.toastr.success(res.message, 'Success');
      let pos = this.products.map(function (e) { return e.id; }).indexOf(id);
      this.products.splice(pos, 1);
    }
    else {
      this.toastr.error(res.message, 'Invalid');
    }
  }
  uploadFile(files, editor) {
    {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("userphoto", files[i], files[i]['name']);
      }
      this._productapi.uploads(formData).subscribe(res => {
        if (res.success) {
          res.data.forEach(path => {
            $(editor).summernote('insertImage', ENV.SERVER_URL + path, '');
          })
        }
      });
    }
  }
  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to event detail
    if (res.success) {
      this.toastr.success(res.message, 'Success');
      this.router.navigate(['/admin/products']);
    }
    else {
      this.toastr.error(res.message, 'Invalid');
    }
  }

  private _handleSubmitError(err) {
    this.toastr.error(err.message, 'Error');
    this.submitting = false;
    this.error = true;
  };
  SaveButton = function (context) {
    var ui = $.summernote.ui;
    var button = ui.button({
      contents: '<i class="fa fa-floppy-o" aria-hidden="true"></i>',
      tooltip: 'save',
      click: function () {
        let apiEvent = context.postEvent()
      }
    });
    return button.render();
  };
  resetForm() {
    this.productForm.reset();
  };

  ngOnDestroy() {
    if (this.submitEventSub) {
      this.submitEventSub.unsubscribe();
    }
    this.formChangeSub.unsubscribe();
  }

}
