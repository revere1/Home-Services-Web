import { Component, OnInit } from '@angular/core';
import { BaseService } from '../services/basic.service';

declare var $:any;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    providers: [BaseService]
})
export class SidebarComponent implements OnInit {
    isActive = false;
    showMenu = '';
    sideBarMenu = [];
    dynamicSideBar : any;
    constructor( private baseService: BaseService) { }
    ngOnInit() {
        $(document).ready(() => {
            const trees: any = $('[data-widget="tree"]');
            trees.tree();
          });
        this.initData();
    }
    initData() {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            if (user.user.access_level === 1)  this.dynamicSideBar = '/assets/sidebar-menu.json';
            else if (user.user.access_level === 2)  this.dynamicSideBar = '/assets/client_sidebar.json';
            else if (user.user.access_level === 3)  this.dynamicSideBar = '/assets/analyst_sidebar.json';
            else if (user.user.access_level === 4)  this.dynamicSideBar = '/assets/editorier_sidebar.json';
        } else {
            this.dynamicSideBar = '/assets/sidebar.json'
        }
        this.baseService.getData(this.dynamicSideBar).then(
          (data) => {
              this.sideBarMenu = data;
          }
      );
    }
    eventCalled() {
        this.isActive = !this.isActive;
    }
    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }
}