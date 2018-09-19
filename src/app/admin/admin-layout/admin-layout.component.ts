import { Component, OnInit, ViewEncapsulation, ViewContainerRef, ElementRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { ScriptService } from '../../services/script.service';
import { AuthService } from '../../services/auth.service';
import { MessagesService } from '../../services/messages.service';
import { HelpService } from '../../services/help.service';
import { LockersService } from '../../services/lockers.service';
import { UtilsService } from '../../services/utils.service';
import { UserService } from '../../services/user.service';
import { ENV } from '../../env.config';
import { ComposeService } from '../../services/compose.service';
import { NotificationService } from '../../services/notifications.service';
import { Router } from '@angular/router';
import { BreadcrumbsService, IBreadcrumb } from 'ng2-breadcrumbs';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminLayoutComponent implements OnInit {
  messagesCount: number;
  problemsCount: number;
  lockersCount: number;
  messagesData: string
  problemsData: string
  notificationCount: number;
  notificationData: string;
  public serverURL = ENV.SERVER_URL;
  public avatar: string = 'assets/img/avatar.png';
  public viewContainerRef: ViewContainerRef;
  public bcList: IBreadcrumb[];

  constructor(public script: ScriptService, public auth: AuthService,
    public toastr: ToastsManager,
    public _utils: UtilsService,
    private router: Router,
    private _userapi: UserService,
    private _notificationapi: NotificationService,
    private _messagesService: MessagesService,
    private _helpService: HelpService,
    private _composeapi: ComposeService,
    private _lockerService: LockersService,
    viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef,
    private breadcrumbsService: BreadcrumbsService) {
    this.viewContainerRef = viewContainerRef;
    this.toastr.setRootViewContainerRef(viewContainerRef);
  }
  loadAssets() {
    this.script.load('adminlte').then(data => {
    }).catch(error => console.log(error));
  }
  ngOnInit() {
    this.bcList = [{ label: 'Home', url: 'home', params: [] }];
    this._utils.changeBreadCrumb(this.bcList);
    this._utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    //Fetch Messages
    // this._messagesService.messagesCount$(currentUser.user.userid, ).subscribe(data => {
    //   if (data.success === false) {
    //   } else {
    //     this.messagesCount = data.count;
    //     this.messagesData = data.data
    //   }
    // });
    //Fetch Problems
    // this._helpService.problemsCount$(currentUser.user.userid, ).subscribe(data => {
    //   if (data.success === false) {
    //   } else {
    //     this.problemsCount = data.count;
    //     this.problemsData = data.data
    //   }
    // });
    //Fetch Problems
    // this._notificationapi.notificationsCount$(currentUser.user.userid).subscribe(data => {
    //   if (data.success === false) {
    //   } else {
    //     this.notificationCount = data.count;
    //     this.notificationData = data.data;
    //   }
    // });
    // this._lockerService.lockersCount$(currentUser.user.userid, ).subscribe(data => {
    //   if (data.success === false) {
    //   } else {
    //     this.lockersCount = data.data.count;
    //   }
    // });
    this.getAvatar();
  }
  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#fff';
  }
  removelistitem(id) {
    this._messagesService.updateIsRead$(id).subscribe(data => {
      $('#relistitem' + id).remove();
      $("#rcount,#rcounthead").text(function (v, n) {
        if (JSON.parse(n) != 0) {
          return JSON.parse(n) - 1;
        } else {
          return 0;
        }
      });
      this.router.navigate(['/admin/messages/read', id])
    });
  }
  removehelpitem(id) {
    // $('#helpitem' + id).remove();
    // $("#rehelpcounthead,#rehelpcount").text(function (v, n) {
    //     if (JSON.parse(n) != 0) {
    //       return JSON.parse(n) - 1;

    //     } else {
    //       return 0;
    //     }
    //   });
    this.router.navigate(['/admin/help/read', id])
  }
  getAvatar() {
    this.avatar = this.auth.currentUser.profile_pic ? ENV.SERVER_URL + this.auth.currentUser.profile_pic : this.avatar;
  }
}
