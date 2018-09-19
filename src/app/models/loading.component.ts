import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <img src="/assets/img/loading.svg">
  `,
  styles: [`    
    img {
      display: block;
      margin: 20px auto;
      width: 50px;
    }
  `]
})
export class LoadingComponent {
}