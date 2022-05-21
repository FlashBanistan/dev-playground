import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  PlayCardModule,
  PlayButtonModule,
  PlayInputTextModule,
  PlayCounterModule,
} from '@dev-playground/play-ui';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    PlayCardModule,
    PlayButtonModule,
    PlayInputTextModule,
    PlayCounterModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
