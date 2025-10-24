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
    <h2 mat-dialog-title>Nova Categoria</h2>

    <mat-dialog-content>
      <form [formGroup]="categoryForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome da Categoria</mat-label>
          <input
            matInput
            formControlName="name"
            placeholder="Ex: Alimentação, Transporte..."
            required
          />
          <mat-error *ngIf="categoryForm.get('name')?.hasError('required')">
            Nome é obrigatório
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSave()"
        [disabled]="categoryForm.invalid || isLoading"
      >
        <mat-icon *ngIf="isLoading">refresh</mat-icon>
        {{ isLoading ? 'Salvando...' : 'Salvar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
      }

      mat-dialog-content {
        padding: 20px 0;
      }

      mat-dialog-actions {
        padding: 20px 0 0 0;
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
