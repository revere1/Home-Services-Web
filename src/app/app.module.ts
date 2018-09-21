
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastModule } from 'ng2-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './_guards/auth.guard';
import { RoleGuard } from './_guards/role.guard';
import { AuthService } from './services/auth.service';
import { NgProgressModule, NgProgressInterceptor } from 'ngx-progressbar';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { HttpModule } from '@angular/http';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepeatModule } from './repeat/repeat.module';
import { ContactUsFormService } from './services/contact_us/contact-us-form.service';
import { UserService } from './services/user.service';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { ComposeService } from './services/compose.service';
import { UtilsService } from './services/utils.service';
import { DatePipe } from '@angular/common';
import { CommodityService } from './services/insights/commodity.service';
import { ScriptService } from './services/script.service';
import { NotificationService } from './services/notifications.service';
import { MessagesService } from './services/messages.service';
import { HelpService } from './services/help.service';
import { LockersService } from './services/lockers.service';
import { MatAutocompleteModule, MatInputModule, MatSelectModule } from '@angular/material';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HelpFormService } from './services/help/help-form.service';
import{InsightcommentFormService} from './services/comment/insightcomment-form.service';
import {FileDropDirective,FileSelectDirective} from 'ng2-file-upload';
import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxUIModule } from '@swimlane/ngx-ui';
import { InsightService } from './services/insights/insight.service';
import { MyWatchListComponent } from './my-watch-list/my-watch-list.component';
import { MacroTypeService } from './services/macrotype.service';
import { NguCarouselModule } from './carousel/ngu-carousel.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LayoutComponent,
    ChangePasswordComponent,
    ProfileComponent,
    ContactUsComponent,
    MainLayoutComponent,
    SidebarComponent,
    MyWatchListComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'Vinod-Revere'}),
    NgxUIModule,
    NgxChartsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    NgProgressModule,   
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RepeatModule,
    ShareButtonsModule.forRoot(),
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    NguCarouselModule    
  ],
  providers: [AuthGuard,
    RoleGuard, AuthService, ContactUsFormService,MacroTypeService, UserService, ComposeService, UtilsService, DatePipe, CommodityService, ScriptService,
    NotificationService, MessagesService, HelpService, LockersService, HelpFormService,InsightService,
    { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true },
    FileDropDirective,
    FileSelectDirective
  ],
  bootstrap: [AppComponent]
})



export class AppModule { 

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
