import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PlayButtonModule } from '../../play-button/play-button.module';
import { PlayCardModule } from '../../play-card/play-card/play-card.module';
import { PlayRippleModule } from '../../play-ripple/play-ripple';

import { PlayModalAlertComponent } from './play-modal-alert.component';

@NgModule({
  imports: [CommonModule, PlayCardModule, PlayButtonModule, PlayRippleModule],
  exports: [PlayModalAlertComponent],
  declarations: [PlayModalAlertComponent],
  providers: [],
})
export class PlayModalAlertModule {}
