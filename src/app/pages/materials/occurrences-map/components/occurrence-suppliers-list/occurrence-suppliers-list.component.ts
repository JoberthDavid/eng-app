import {
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import {
  OccurrenceSupplier
} from '../../../../../models/occurrence.models';

import {
  OccurrenceService
} from '../../../../../services/occurrence.service';


@Component({
  selector: 'app-occurrence-suppliers-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './occurrence-suppliers-list.component.html',
  styleUrl: './occurrence-suppliers-list.component.scss'
})
export class OccurrenceSuppliersListComponent
  implements OnInit, OnDestroy {

  private readonly service = inject(OccurrenceService);

  private subscription?: Subscription;

  suppliers: OccurrenceSupplier[] = [];

  loading = true;
  errorMessage: string | null = null;

  searchTerm = '';
  selectedStatus = 'all';

  currentPage = 1;
  pageSize = 10;

  readonly pageSizes = [10, 25, 50];
  readonly Math = Math;

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private loadData(): void {
    this.loading = true;
    this.errorMessage = null;

    this.subscription = this.service.getSuppliers().subscribe({
      next: suppliers => {
        this.suppliers = suppliers;
        this.loading = false;
      },
      error: () => {
        this.errorMessage =
          'Não foi possível carregar os fornecedores.';

        this.loading = false;
      }
    });
  }

  get filteredSuppliers(): OccurrenceSupplier[] {
    const search = this.searchTerm
      .trim()
      .toLocaleLowerCase('pt-BR');

    return this.suppliers.filter(supplier => {

      const searchableText = [
        supplier.legal_name,
        supplier.trade_name,
        supplier.cnpj,
        supplier.phone,
        supplier.email,
        supplier.legal_representative
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('pt-BR');

      if (search && !searchableText.includes(search)) {
        return false;
      }

      if (
        this.selectedStatus === 'active' &&
        !supplier.active
      ) {
        return false;
      }

      if (
        this.selectedStatus === 'inactive' &&
        supplier.active
      ) {
        return false;
      }

      return true;
    });
  }

  get paginatedSuppliers(): OccurrenceSupplier[] {
    const start = (this.currentPage - 1) * this.pageSize;

    return this.filteredSuppliers.slice(
      start,
      start + this.pageSize
    );
  }

  get totalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.filteredSuppliers.length / this.pageSize)
    );
  }

  get totalSuppliers(): number {
    return this.suppliers.length;
  }

  get activeSuppliers(): number {
    return this.suppliers.filter(item => item.active).length;
  }

  get inactiveSuppliers(): number {
    return this.suppliers.filter(item => !item.active).length;
  }

  applyFilters(): void {
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.currentPage = 1;
  }

  changePageSize(value: string): void {
    this.pageSize = Number(value);
    this.currentPage = 1;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}