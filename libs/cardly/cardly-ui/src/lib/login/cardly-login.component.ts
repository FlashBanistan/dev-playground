import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlayInputTextComponent, PlayLoadingDirective } from '@playground/play-ui';

@Component({
  selector: 'cardly-login',
  templateUrl: './cardly-login.component.html',
  styleUrls: ['./cardly-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, PlayInputTextComponent, PlayLoadingDirective],
})
export class CardlyLoginComponent {
  displayName = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]);

  @Input() loading: boolean;
  @Output() login = new EventEmitter<string>();

  onSubmit(): void {
    if (this.displayName.valid) {
      this.login.emit(this.displayName.value);
    }
  }
}
