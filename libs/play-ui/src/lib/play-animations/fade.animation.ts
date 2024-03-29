import { animate, state, style, transition, trigger } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  state('in', style({ opacity: 1 })),
  transition(':enter', [style({ opacity: 0 }), animate('300ms')]),
  transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
]);
