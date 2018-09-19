import { Component, OnInit,AfterViewInit,ElementRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-tickers-layout',
  templateUrl: './tickers-layout.component.html',
  styleUrls: ['./tickers-layout.component.css']
})
export class TickersLayoutComponent implements OnInit,AfterViewInit{
  public id : any;
  constructor(private route:ActivatedRoute,
             private elementRef: ElementRef,
              private auth: AuthService) {
                auth.loadSession();
               }
               ngAfterViewInit(){
                this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#fff';
             }

  ngOnInit() {
    this.route.parent.params
    .subscribe(params => {
      this.id = params['id']
    })
  }

}
