import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxEchartsModule } from 'ngx-echarts';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from '../../services/category.service';
import { Transaction, TransactionType } from '../../models/transaction.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTabsModule,
    NgxEchartsModule,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent implements OnInit {
  transactions: Transaction[] = [];
  categories: Category[] = [];

  totalIncome = 0;
  totalExpense = 0;
  balance = 0;

  initOpts = {
    renderer: 'svg',
    width: 'auto',
    height: 'auto',
  };

  categoryChartOptions: any = {};
  incomeExpenseChartOptions: any = {};
  monthlyChartOptions: any = {};

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.transactionService.getAllTransactions(currentUser.id).subscribe({
        next: (response) => {
          this.transactions = Array.isArray(response) ? response : (response as any).data || [];
          this.calculateTotals();
          this.generateCharts();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao carregar transações:', error);
          this.transactions = [];
          this.cdr.detectChanges();
        },
      });

      this.categoryService.getAllCategories().subscribe({
        next: (response) => {
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
  }

  calculateTotals(): void {
    this.totalIncome = this.transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amountInCents, 0);

    this.totalExpense = this.transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amountInCents, 0);

    this.balance = this.totalIncome - this.totalExpense;
  }

  generateCharts(): void {
    this.generateCategoryChart();
    this.generateIncomeExpenseChart();
    this.generateMonthlyChart();
  }

  generateCategoryChart(): void {
    const categoryData = this.categories
      .map((category) => {
        const amount = this.transactions
          .filter((t) => t.categoryId === category.id && t.type === TransactionType.EXPENSE)
          .reduce((sum, t) => sum + t.amountInCents, 0);

        return {
          name: category.name,
          value: amount / 100,
        };
      })
      .filter((item) => item.value > 0);

    this.categoryChartOptions = {
      title: {
        text: 'Gastos por Categoria',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'Gastos',
          type: 'pie',
          radius: '50%',
          data: categoryData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }

  generateIncomeExpenseChart(): void {
    this.incomeExpenseChartOptions = {
      title: {
        text: 'Receitas vs Despesas',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['Receitas', 'Despesas'],
      },
      xAxis: {
        type: 'category',
        data: ['Total'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Receitas',
          type: 'bar',
          data: [this.totalIncome / 100],
          itemStyle: {
            color: '#4caf50',
          },
        },
        {
          name: 'Despesas',
          type: 'bar',
          data: [this.totalExpense / 100],
          itemStyle: {
            color: '#f44336',
          },
        },
      ],
    };
  }

  generateMonthlyChart(): void {
    const monthlyData = this.getMonthlyData();

    this.monthlyChartOptions = {
      title: {
        text: 'Evolução Mensal',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Receitas', 'Despesas', 'Saldo'],
      },
      xAxis: {
        type: 'category',
        data: monthlyData.months,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Receitas',
          type: 'line',
          data: monthlyData.incomes,
          itemStyle: {
            color: '#4caf50',
          },
        },
        {
          name: 'Despesas',
          type: 'line',
          data: monthlyData.expenses,
          itemStyle: {
            color: '#f44336',
          },
        },
        {
          name: 'Saldo',
          type: 'line',
          data: monthlyData.balances,
          itemStyle: {
            color: '#2196f3',
          },
        },
      ],
    };
  }

  getMonthlyData(): {
    months: string[];
    incomes: number[];
    expenses: number[];
    balances: number[];
  } {
    const monthlyMap = new Map<string, { income: number; expense: number }>();

    this.transactions.forEach((transaction) => {
      const month = new Date(transaction.date).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'short',
      });

      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, { income: 0, expense: 0 });
      }

      const data = monthlyMap.get(month)!;
      if (transaction.type === TransactionType.INCOME) {
        data.income += transaction.amountInCents;
      } else {
        data.expense += transaction.amountInCents;
      }
    });

    const months = Array.from(monthlyMap.keys()).sort();
    const incomes = months.map((month) => monthlyMap.get(month)!.income / 100);
    const expenses = months.map((month) => monthlyMap.get(month)!.expense / 100);
    const balances = months.map(
      (month) => (monthlyMap.get(month)!.income - monthlyMap.get(month)!.expense) / 100
    );

    return { months, incomes, expenses, balances };
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  }
}
