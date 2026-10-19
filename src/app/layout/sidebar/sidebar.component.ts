
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  inject
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive,
  Router
} from '@angular/router';

import {
  AsyncPipe
} from '@angular/common';

import {
  CompositionTreeComponent
} from '../../components/composition-tree/composition-tree.component';

import {
  CompositionTreeNode
} from '../../models/composition-tree.model';

import {
  CompositionNavigationService
} from '../../services/composition-navigation.service';

import {
  AuthService
} from '../../core/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CompositionTreeComponent,
    AsyncPipe
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly compositionNavigationService =
    inject(CompositionNavigationService);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly compositionTree =
    this.compositionNavigationService.activeTree;

  readonly selectedNode =
    this.compositionNavigationService.selectedNode;

  @Input()
  appName = 'ENG-APP';

  @Input()
  appSubtitle = 'Engenharia';

  @Input()
  mobileOpen = false;

  @Output()
  closeRequested = new EventEmitter<void>();

  readonly currentUser$ = this.authService.currentUser$;

  @HostBinding('class.sidebar-host-open')
  get hostOpen(): boolean {
    return this.mobileOpen;
  }

  get selectedCompositionCode(): string | null {
    const node = this.selectedNode();

    if (!node) {
      return null;
    }

    return node.composition.code;
  }

  onCompositionSelected(node: CompositionTreeNode): void {
    this.compositionNavigationService.selectNode(node);
    this.closeRequested.emit();
  }

  closeNavigation(): void {
    this.closeRequested.emit();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.closeRequested.emit();
        void this.router.navigate(['/login']);
      },
      error: () => {
        this.authService.clearSession();
        this.closeRequested.emit();
        void this.router.navigate(['/login']);
      }
    });
  }
}
