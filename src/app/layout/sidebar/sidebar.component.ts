import {
  Component,
  Input,
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

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);


  readonly compositionTree =
    this.compositionNavigationService.activeTree;

  readonly selectedNode =
    this.compositionNavigationService.selectedNode;


  @Input()
  appName = 'ENG-APP';


  @Input()
  appSubtitle = 'Engenharia';


  /*
   * Usuário autenticado.
   *
   * Como currentUser$ é um Observable, o template
   * pode usar async futuramente.
   */
  readonly currentUser$ =
    this.authService.currentUser$;


  get selectedCompositionCode(): string | null {

    const node =
      this.selectedNode();

    if (!node) {
      return null;
    }

    return node.composition.code;
  }


  onCompositionSelected(
    node: CompositionTreeNode
  ): void {

    this.compositionNavigationService
      .selectNode(node);
  }


  /**
   * Encerra a sessão no Manifold.
   */
  logout(): void {

    this.authService
      .logout()
      .subscribe({

        next: () => {

          void this.router.navigate([
            '/login'
          ]);

        },

        error: () => {

          /*
           * Mesmo que o servidor esteja indisponível,
           * não queremos deixar o token local ativo.
           */
          this.authService.clearSession();

          void this.router.navigate([
            '/login'
          ]);

        }

      });
  }
}