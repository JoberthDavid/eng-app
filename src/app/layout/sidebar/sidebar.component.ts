import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() appName = 'ENG-APP';
  @Input() appSubtitle = 'Engenharia';

  @Output() menuSelected = new EventEmitter<string>();

  selectMenu(menu: string): void {
    this.menuSelected.emit(menu);
  }
}