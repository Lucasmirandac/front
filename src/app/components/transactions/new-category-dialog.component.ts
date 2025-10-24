import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-new-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon>add_circle</mat-icon>
        Nova Categoria
      </h2>

      <mat-dialog-content class="dialog-content">
        <p class="dialog-subtitle">Crie uma nova categoria para organizar suas transações</p>
        <form [formGroup]="categoryForm" class="category-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nome da Categoria</mat-label>
            <input
              matInput
              formControlName="name"
              placeholder="Ex: Alimentação, Transporte, Lazer..."
              required
            />
            <mat-icon matSuffix>category</mat-icon>
            <mat-error *ngIf="categoryForm.get('name')?.hasError('required')">
              Nome é obrigatório
            </mat-error>
            <mat-error *ngIf="categoryForm.get('name')?.hasError('minlength')">
              Nome deve ter pelo menos 2 caracteres
            </mat-error>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-button">
          <mat-icon>close</mat-icon>
          Cancelar
        </button>
        <button
          mat-raised-button
          color="primary"
          (click)="onSave()"
          [disabled]="categoryForm.invalid || isLoading"
          class="save-button"
        >
          <mat-icon *ngIf="isLoading">refresh</mat-icon>
          <mat-icon *ngIf="!isLoading">check</mat-icon>
          {{ isLoading ? 'Salvando...' : 'Salvar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        padding: 0;
      }

      .dialog-title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 1.5rem;
        font-weight: 600;
        color: #3f51b5;
        margin: 0;

        mat-icon {
          font-size: 1.5rem;
          width: 1.5rem;
          height: 1.5rem;
        }
      }

      .dialog-content {
        padding: 24px 0;

        .dialog-subtitle {
          color: #757575;
          font-size: 1rem;
          margin: 0 0 24px 0;
        }

        .category-form {
          .full-width {
            width: 100%;
          }
        }
      }

      .dialog-actions {
        padding: 16px 0 0 0;
        gap: 12px;

        .cancel-button {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #757575;
        }

        .save-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 24px;
          font-weight: 600;
        }
      }
    `,
  ],
})
export class NewCategoryDialogComponent {
  categoryForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<NewCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  onSave(): void {
    if (this.categoryForm.valid) {
      this.isLoading = true;
      const categoryData = this.categoryForm.value;

      this.categoryService.createCategory(categoryData).subscribe({
        next: (category) => {
          this.dialogRef.close(category);
        },
        error: (error) => {
          console.error('Erro ao criar categoria:', error);
          this.isLoading = false;
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
