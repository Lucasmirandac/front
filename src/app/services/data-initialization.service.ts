import { Injectable } from '@angular/core';
import { CategoryService } from './category.service';
import { CreateCategoryRequest } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class DataInitializationService {
  constructor(private categoryService: CategoryService) {}

  initializeDefaultCategories(): void {
    const defaultCategories: CreateCategoryRequest[] = [
      { name: 'Alimentação' },
      { name: 'Transporte' },
      { name: 'Moradia' },
      { name: 'Saúde' },
      { name: 'Educação' },
      { name: 'Lazer' },
      { name: 'Roupas' },
      { name: 'Salário' },
      { name: 'Freelance' },
      { name: 'Investimentos' },
    ];

    // Verificar se já existem categorias
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        if (categories.length === 0) {
          // Criar categorias padrão
          defaultCategories.forEach((category) => {
            this.categoryService.createCategory(category).subscribe({
              next: () => console.log(`Categoria ${category.name} criada`),
              error: (error) => console.error(`Erro ao criar categoria ${category.name}:`, error),
            });
          });
        }
      },
      error: (error) => {
        console.error('Erro ao verificar categorias:', error);
      },
    });
  }
}
