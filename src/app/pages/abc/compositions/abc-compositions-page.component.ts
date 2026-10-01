import {
  Component,
  inject
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  AbcCompositionResult
} from '../../../models/abc.models';

import {
  AbcCompositionService
} from '../../../services/abc-composition.service';


@Component({
  selector:
    'app-abc-compositions-page',

  standalone:
    true,

  imports: [
    RouterLink
  ],

  templateUrl:
    './abc-compositions-page.component.html',

  styleUrl:
    './abc-compositions-page.component.scss'
})
export class AbcCompositionsPageComponent {

  private readonly route =
    inject(ActivatedRoute);

  private readonly abcService =
    inject(AbcCompositionService);


  readonly result:
    AbcCompositionResult | null;


  constructor() {

    const budgetId =
      this.route.snapshot.paramMap
        .get('budgetId');


    this.result =
      budgetId
        ? this.abcService.getByBudgetId(
            budgetId
          )
        : null;
  }
}