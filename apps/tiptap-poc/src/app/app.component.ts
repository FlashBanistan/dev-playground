import { Component } from '@angular/core';

@Component({
  selector: 'playground-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  onTipTapUpdate(json: string) {
    console.log(json);
  }
}
