import { Component, OnInit, ViewEncapsulation, ViewContainerRef,ElementRef, AfterViewInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AuthLayoutComponent implements OnInit,AfterViewInit {

  public viewContainerRef: ViewContainerRef;
  
  public constructor(public toastr: ToastsManager,private elementRef: ElementRef, viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
    this.toastr.setRootViewContainerRef(viewContainerRef);
  }
  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#d1d3d4';
 }
// ngAfterViewInit(){
//   this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#fff';
// }
  ngOnInit() {
  }

}
