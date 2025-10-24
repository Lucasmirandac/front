import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from '../../services/category.service';
import {
  Transaction,
  TransactionType,
  CreateTransactionRequest,
} from '../../models/transaction.model';
import { Category } from '../../models/category.model';
import { User } from '../../models/user.model';
import { NewCategoryDialogComponent } from './new-category-dialog.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTabsModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  transactionForm: FormGroup;
  transactions: Transaction[] = [];
  categories: Category[] = [];
  isLoading = false;
  displayedColumns: string[] = ['title', 'type', 'amount', 'date', 'actions'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.transactionForm = this.fb.group({
      title: ['', [Validators.required]],
      type: ['expense', [Validators.required]],
      categoryId: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString().split('T')[0], [Validators.required]],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadTransactions();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        // Verificar se a resposta é um array ou um objeto com propriedade data
        this.categories = Array.isArray(response) ? response : (response as any).data || [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
        this.categories = [];
        this.cdr.detectChanges();
      },
    });
  }

  loadTransactions(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.transactionService.getAllTransactions(currentUser.id).subscribe({
        next: (response) => {
          // Verificar se a resposta é um array ou um objeto com propriedade data
          this.transactions = Array.isArray(response) ? response : (response as any).data || [];
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao carregar transações:', error);
          this.transactions = [];
          this.cdr.detectChanges();
        },
      });
    }
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.isLoading = true;
      const currentUser = this.authService.getCurrentUser();

      if (!currentUser) {
        this.snackBar.open('Usuário não encontrado', 'Fechar', { duration: 3000 });
        return;
      }

      const formData = this.transactionForm.value;
      const transactionData: CreateTransactionRequest = {
        title: formData.title,
        type: formData.type,
        categoryId: formData.categoryId,
        amountInCents: Math.round(formData.amount * 100),
        userId: currentUser.id,
        date: formData.date,
        description: formData.description,
      };

      this.transactionService.createTransaction(transactionData).subscribe({
        next: (transaction) => {
          this.snackBar.open('Transação criada com sucesso!', 'Fechar', { duration: 3000 });
          this.transactionForm.reset();
          this.transactionForm.patchValue({
            type: 'expense',
            date: new Date().toISOString().split('T')[0],
          });
          this.loadTransactions();
        },
        error: (error) => {
          this.snackBar.open('Erro ao criar transação', 'Fechar', { duration: 3000 });
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  deleteTransaction(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          this.snackBar.open('Transação excluída com sucesso!', 'Fechar', { duration: 3000 });
          this.loadTransactions();
        },
        error: (error) => {
          this.snackBar.open('Erro ao excluir transação', 'Fechar', { duration: 3000 });
        },
      });
    }
  }

  openNewCategoryDialog(): void {
    const dialogRef = this.dialog.open(NewCategoryDialogComponent, {
      width: '400px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((newCategory: Category) => {
      if (newCategory) {
        this.categories.push(newCategory);
        this.transactionForm.patchValue({ categoryId: newCategory.id });
        this.snackBar.open('Categoria criada com sucesso!', 'Fechar', { duration: 3000 });
        this.cdr.detectChanges();
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
