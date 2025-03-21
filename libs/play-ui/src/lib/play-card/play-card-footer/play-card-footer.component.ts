import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

@Component({
    selector: 'play-card-footer',
    templateUrl: './play-card-footer.component.html',
    styleUrls: ['./play-card-footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule]
})
export class PlayCardFooterComponent {
  @HostBinding('class') className = 'play-card-footer';
  @HostBinding('style.justify-content') justifyContent = 'left';
  @Input() set position(
    value: 'left' | 'center' | 'right' | 'space-around' | 'space-between'
  ) {
    this.justifyContent = value;
  }
}
