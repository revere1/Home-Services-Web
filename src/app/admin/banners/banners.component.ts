import { Component, OnInit } from '@angular/core';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ENV } from '../../env.config';
import { BannersService } from '../../services/banners.service';
import { FormControl,FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoriesService } from '../../services/categories.service';
import { ToastsManager } from '../../../../node_modules/ng2-toastr';
import { Router } from '../../../../node_modules/@angular/router';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit {
 
 bannerForm = this.fb.group({
    btype: ['',Validators.required],
    btype_id: ['',Validators.required],
    status: ['',Validators.required],
  });
  showModel: boolean = false;
  public config: DropzoneConfigInterface = {};
  public btypes:any = [];
  public banners:any = [];
  public btype:string = "Cat/Prod";
  file_error: any;
  festatus:boolean = false;
  uploadFile:string;
  
  dtOptions: DataTables.Settings = {};
  public serverURL = ENV.SERVER_URL;
  constructor(
    private _bservice:BannersService,
    private fb: FormBuilder,
    public toastr: ToastsManager,
    private _router:Router,
    private _utils: UtilsService
   ) { }

  ngOnInit() {
    let that = this;
    var maxImageWidth = 330, maxImageHeight = 80;
    this.config = {
      url: ENV.BASE_API + 'banners/path?token=' + this._bservice.getToken(),
      maxFiles: ENV.BANNERS_MAX_FILES,
      clickable: true,
      createImageThumbnails: true,
      addRemoveLinks: true,
      acceptedFiles: 'image/*',
      thumbnailWidth:330,
      thumbnailHeight:80,
      init: function (){
        let drop = this;
        this.on('removedfile', function (file) {
          if (file.status === 'error') {
            // let index = (that.uploadFiles).indexOf(that.uploadFilesObj[file.upload.uuid]);
            // if (index > -1) {
            //   return false;
            // }
          }
          that.festatus = false;
        });

        this.on("thumbnail", function(file) {
          if (file.width > maxImageWidth || file.height > maxImageHeight) {
            file.rejectDimensions()
            this.removeFile(file);
            that.file_error = "Banner size should be 330 X 80 ";
          }
          else {
            file.acceptDimensions();
          }
        });
      },
      accept: function (file:any, done) {
        file.acceptDimensions = done;
        file.rejectDimensions = function() { 
          done("Invalid dimension.");
         
         };
      }
    }
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        var myEfficientFn = this._utils.debounce(()=>{           
           let apiEvent= this._bservice.filterBanners$(dataTablesParameters,'get-banners')
            .subscribe(resp => {
              that.banners = resp.data;  
              console.log(that.banners)
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: []
              });
            });   
            // (this.apiEvents).push(apiEvent);      
        },1000,false);

        myEfficientFn();
        
        
      },
      columns: [
            { data: 'banner' },
            { data: 'btype' },
            { data: 'status' },
            { data: 'id' }
          ]
    };
   }


  modelopen(id)
  {    
    this.showModel = true;
  }
  bannerType(type:any){
    if(type == 1){
      this.btype = "Category";
     this._bservice.getAllActiveCats().subscribe(btypes => this.btypes  = btypes.categories);
    }
    if(type == 2){
      this.btype = "Product";
     this._bservice.getAllActiveProducts().subscribe(btypes => this.btypes  = btypes.products);;
    }
  }
  saveBanner(){
    
    if(this.uploadFile != ''){
      let data = {
                  banner:this.uploadFile,
                  btype:this.bannerForm.controls.btype.value,
                  btype_id:this.bannerForm.controls.btype_id.value,
                  status:this.bannerForm.controls.status.value
                 }
      this._bservice.saveBanner(data).subscribe(res=>{
        if (res.success) {
          this.toastr.success(res.message, 'Success');
          this._router.navigate(['/admin/banners']);
        }
        else {
          this.toastr.error(res.message, 'Invalid');
        }
        },
      err=>{
        this.toastr.error(err.message, 'Invalid');
      });
    }
    else
    {
      this.festatus = false;
      this.file_error = "Upload banner";
    }
  }
  resetForm(){
    this.bannerForm.reset();
  }
  public onUploadSuccess(eve) {
    if ((eve[1].success !== undefined) && eve[1].success) {
      this.file_error = '';      
      this.uploadFile = eve[1].data;
      this.festatus = true;
    }
    else {
      this.file_error = 'Something Went Wrong';
    }    
  }
  public onUploadError(eve) {
    this.file_error = eve[1];
  }
  private removeFile(file) {
    this.festatus = false;
    // let apiEvent = this._bservice.removeFile(file).subscribe(
    //   data => {
    //     this._handleSubmitSuccess(data);
    //   },
    //   err => this._handleSubmitError(err)
    // );
    
  }
  
}
