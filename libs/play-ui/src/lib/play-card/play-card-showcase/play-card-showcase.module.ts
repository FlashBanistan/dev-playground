import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PlayButtonModule } from '../../play-button/play-button.module';
import { PlayCheckboxModule } from '../../play-checkbox/play-checkbox.module';
import { PlayIconRegistryService } from '../../play-icon/play-icon-registry.service';
import { PlayIconModule } from '../../play-icon/play-icon.module';
import { close } from '../../play-icon/play-icons';
import { PlayRippleModule } from '../../play-ripple/play-ripple';
import { PlayCardModule } from '../play-card/play-card.module';

import { PlayCardShowcaseComponent } from './play-card-showcase.component';

@NgModule({
  imports: [
    CommonModule,
    PlayCardModule,
    PlayButtonModule,
    PlayIconModule,
    PlayRippleModule,
    PlayCheckboxModule,
  ],
  exports: [PlayCardShowcaseComponent],
  declarations: [PlayCardShowcaseComponent],
  providers: [],
})
export class PlayCardShowcaseModule {
  constructor(private playIconService: PlayIconRegistryService) {
    this.playIconService.registerIcons([close]);
  }
}
