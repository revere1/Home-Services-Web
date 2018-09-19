import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-sectors-about',
  templateUrl: './sectors-about.component.html',
  styleUrls: ['./sectors-about.component.css']
})
export class SectorsAboutComponent implements OnInit {

  constructor(private auth: AuthService) { 
    auth.loadSession();
  }

  ngOnInit() {
  }

}
