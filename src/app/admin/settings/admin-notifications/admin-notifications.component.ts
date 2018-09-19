import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ComposeService } from '../../../services/compose.service';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NotificationService } from '../../../services/notifications.service';
import { UtilsService } from '../../../services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http';
@Component({
  selector: 'app-admin-notifications',
  templateUrl: './admin-notifications.component.html',
  styleUrls: ['./admin-notifications.component.css']
})
export class AdminNotificationsComponent implements OnInit {
  objLen: number = 10;
  public noRecords: boolean = true;
  notifications = [];
  currentUserId = JSON.parse(localStorage.getItem('currentUser')).user.userid;
  dtOptions = {
    "draw": 1,
    "columns": [
      { "data": "message", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "id", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } }],
    "order": [
      { "column": "createdAt", "dir": "desc" }
    ],
    "start": 0,
    "length": this.objLen,
    "currentUserId": this.currentUserId,
    "search": { "value": "", "regex": false }
  };
  finished = false  // boolean when end of database is reached
  probFilterForm: FormGroup = this.fb.group({
    sortBy: ['recent'],
    quickFilter: [''],
  });
  constructor(private fb: FormBuilder,
    private _notificationapi: NotificationService,
    private _utils: UtilsService) { }

  ngOnInit() {
    $('#reduceNotifCount').text(function (v, n) {
        return 0
    });
    this.getNotifications();
    this.onChanges();
  }

  onChanges() {
    this.probFilterForm.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(val => {
        this.dtOptions.search = { "value": val.quickFilter, "regex": false };
        this.dtOptions.order[0].dir = (val.sortBy === 'recent') ? "desc" : 'asc';
        this.dtOptions.start = 0;
        this.finished = false;
        this.dtOptions.length = this.objLen;
        this.notifications = [];
        this.getNotifications();
      });
  }

  onScroll() {
    this.dtOptions.start += this.objLen;
    this.getNotifications();
  }
  private getNotifications(append = true) {
    if (this.finished) return;
    this._notificationapi
      .filterNotifications$(this.dtOptions, 'filter-notifications')
      .subscribe(data => {
        if (this.noRecords && data.data.length) {
          this.noRecords = false;
        }
        if (data.data.length !== this.objLen) {
          this.finished = true;
        }
        this.notifications = (this.notifications).concat(data.data);
      })
  }
}
