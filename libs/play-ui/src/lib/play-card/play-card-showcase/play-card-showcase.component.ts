import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'play-card-showcase',
  templateUrl: './play-card-showcase.component.html',
  styleUrls: ['./play-card-showcase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayCardShowcaseComponent {}
