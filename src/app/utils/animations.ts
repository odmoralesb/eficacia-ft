import {animate, style, transition, trigger} from "@angular/animations";

/* Animaciones recomendadas de transición */
export const fly = trigger('fly', [
  transition(':enter', [
    style({ transform: 'translateY(33px)', opacity: 0 }),
    animate("500ms ease", style({ transform: 'translateY(0)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate("500ms ease", style({ transform: 'translateY(33px)', opacity: 0 }))
  ])
]);


export const fade = trigger('fade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate("333ms ease", style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate("333ms ease", style({ opacity: 0 }))
  ])
]);

export const smooth = trigger('smooth', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate("550ms ease", style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate("550ms ease", style({ opacity: 0 }))
  ])
]);
