import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'play-sidenav-content',
  templateUrl: './play-sidenav-content.component.html',
  styleUrls: ['./play-sidenav-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PlaySidenavContentComponent {
  @HostBinding('class.play-sidenav-content') showClass = true;
}
