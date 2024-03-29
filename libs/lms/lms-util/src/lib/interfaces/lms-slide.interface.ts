import { FormControl } from '@angular/forms';

export interface LmsSlide {
  id: string;
  name: string;
  description: string;
}

export const getLmsSlide = (): LmsSlide => ({
  id: '',
  name: '',
  description: '',
});

export interface LmsSlideForm {
  id: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
}

export type LmsSlideCreate = Omit<LmsSlide, 'id'>;
