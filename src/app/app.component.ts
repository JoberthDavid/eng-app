import {
  Component,
  DestroyRef,
  inject
} from '@angular/core';

import {
  NavigationEnd,
  Router,
  RouterOutlet
} from '@angular/router';

import { filter } from 'rxjs';

import { SidebarComponent } from './layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  appName = 'ENG-APP';
  appSubtitle = 'Engenharia';

  currentSection = 'Projetos';

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    const subscription = this.router.events
      .pipe(
        filter(
          event => event instanceof NavigationEnd
        )
      )
      .subscribe(() => {
        this.currentSection =
          this.getSectionFromRoute(this.router.url);
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });

    this.currentSection =
      this.getSectionFromRoute(this.router.url);
  }

  private getSectionFromRoute(url: string): string {
    if (url.startsWith('/budgets')) {
      return 'Orçamentos';
    }

    if (url.startsWith('/compositions')) {
      return 'Composições';
    }

    if (url.startsWith('/projects')) {
      return 'Projetos';
    }

    return 'Projetos';
  }
}