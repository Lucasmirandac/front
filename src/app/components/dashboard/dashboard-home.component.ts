import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { TransactionSummary } from '../../models/transaction.model';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatGridListModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
})
export class DashboardHomeComponent implements OnInit {
  summary: TransactionSummary | null = null;

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.transactionService.getTransactionSummary(currentUser.id).subscribe({
        next: (response) => {
          // Verificar se a resposta é um objeto ou tem propriedade data
          this.summary = (response as any).data || response;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao carregar resumo:', error);
          this.summary = null;
          this.cdr.detectChanges();
        },
      });
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  }

  goToTransactions(): void {
    this.router.navigate(['/transactions']);
  }

  goToReports(): void {
    this.router.navigate(['/reports']);
  }
}
