import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { SubCategoryModel } from '../../../models/sub-category.model';
import { SubcategoriesService } from '../../../services/subcategories.service';
@Component({
  selector: 'app-update-sub-category',
  templateUrl: './update-sub-category.component.html',
  styleUrls: ['./update-sub-category.component.css']
})
export class UpdateSubCategoryComponent implements OnInit {

  loading: boolean;
  subsector: SubCategoryModel;
  routeSub: Subscription;
  private id: number;
  subSectorSub: Subscription;
  error: boolean;
  constructor(private route: ActivatedRoute,

    private _subCategoryapi: SubcategoriesService,
    public utils: UtilsService) { }

  ngOnInit() {

    // Set event ID from route params and subscribe
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
        this._getSubSector();
      });
  }
  private _getSubSector() {
    this.loading = true;
    // GET event by ID
    this.subSectorSub = this._subCategoryapi
      .getSubCategoryById$(this.id)
      .subscribe(
        res => {
          if (res.success) {
            this.subsector = res.data;
          }
          this.loading = false;
        },
        err => {
          this.loading = false;
          this.error = true;
        }
      );
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.subSectorSub.unsubscribe();
  }

}
