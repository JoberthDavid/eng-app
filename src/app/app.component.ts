
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

import {
  filter
} from 'rxjs';

import {
  SidebarComponent
} from './layout/sidebar/sidebar.component';

type ThemePreference = 'light' | 'dark' | 'system';

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

  mobileNavigationOpen = false;
  themePreference: ThemePreference = 'system';

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly mediaQuery =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null;

  private readonly onSystemThemeChange = (): void => {
    if (this.themePreference === 'system') {
      this.applyTheme();
    }
  };

  themeMenuOpen = false;

  constructor() {
    this.loadThemePreference();
    this.applyTheme();

    const subscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.currentSection =
          this.getSectionFromRoute(this.router.url);

        this.closeMobileNavigation();
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
      this.mediaQuery?.removeEventListener(
        'change',
        this.onSystemThemeChange
      );
    });

    this.mediaQuery?.addEventListener(
      'change',
      this.onSystemThemeChange
    );

    this.currentSection =
      this.getSectionFromRoute(this.router.url);
  }

  get isAuthenticationPage(): boolean {
    return (
      this.router.url.startsWith('/login') ||
      this.router.url.startsWith('/2fa')
    );
  }

  get themeLabel(): string {
    switch (this.themePreference) {
      case 'light':
        return 'Tema claro';
      case 'dark':
        return 'Tema escuro';
      default:
        return 'Tema do sistema';
    }
  }

  setTheme(preference: ThemePreference): void {
    this.themePreference = preference;

    try {
      localStorage.setItem(
        'eng-app-theme',
        preference
      );
    } catch {
      // A aplicação continua funcional se o armazenamento
      // estiver indisponível no navegador.
    }

    this.applyTheme();
  }

  toggleThemeMenu(): void {
    this.themeMenuOpen = !this.themeMenuOpen;
  }

  closeThemeMenu(): void {
    this.themeMenuOpen = false;
  }

  selectTheme(preference: ThemePreference): void {
    this.setTheme(preference);
    this.closeThemeMenu();
  }

  toggleMobileNavigation(): void {
    this.mobileNavigationOpen =
      !this.mobileNavigationOpen;
  }

  closeMobileNavigation(): void {
    this.mobileNavigationOpen = false;
  }

  onNavigationKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMobileNavigation();
      this.closeThemeMenu();
    }
  }

  private loadThemePreference(): void {
    try {
      const saved = localStorage.getItem('eng-app-theme');

      if (
        saved === 'light' ||
        saved === 'dark' ||
        saved === 'system'
      ) {
        this.themePreference = saved;
      }
    } catch {
      this.themePreference = 'system';
    }
  }

  private applyTheme(): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.setAttribute(
      'data-theme',
      this.themePreference
    );
  }

  private getSectionFromRoute(url: string): string {
    if (url.startsWith('/budgets')) {
      return 'Orçamentos';
    }

    if (
      url.startsWith('/compositions') ||
      url.includes('/compositions/')
    ) {
      return 'Composições';
    }

    if (url.startsWith('/mowing-workload-level')) {
      return 'Nível de esforço';
    }

    if (url.startsWith('/bdi')) {
      return 'BDI';
    }

    if (url.startsWith('/projects')) {
      return 'Projetos';
    }

    if (url.startsWith('/materials-quotation')) {
      return 'Cotação de materiais';
    }

    if (url.startsWith('/bituminous-material')) {
      return 'Materiais betuminosos';
    }

    if (url.startsWith('/materials')) {
      return 'Materiais';
    }

    if (url.startsWith('/occurrences')) {
      return 'Mapa de ocorrências';
    }

    if (url.startsWith('/logistics')) {
      return 'Transportes';
    }

    if (url.startsWith('/timeline')) {
      return 'Cronograma';
    }

    if (url.startsWith('/annual-work-plan-budget')) {
      return 'Plano anual de trabalho';
    }

    if (url.startsWith('/abc')) {
      return 'Curva ABC';
    }

    if (url.startsWith('/fit')) {
      return 'FIT';
    }

    return 'Projetos';
  }
}
