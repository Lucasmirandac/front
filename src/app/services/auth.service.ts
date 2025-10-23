import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private userService: UserService, @Inject(PLATFORM_ID) private platformId: Object) {
    // Verificar se há usuário salvo no localStorage apenas no navegador
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUserSubject.next(JSON.parse(savedUser));
      }
    }
  }

  login(email: string, password: string): Observable<User> {
    return new Observable((observer) => {
      this.userService.getAllUsers().subscribe({
        next: (users) => {
          const user = users.find((u) => u.email === email);
          if (user) {
            // Em uma implementação real, você verificaria a senha aqui
            this.setCurrentUser(user);
            observer.next(user);
            observer.complete();
          } else {
            observer.error('Usuário não encontrado');
          }
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

  register(userData: any): Observable<User> {
    return new Observable((observer) => {
      this.userService.createUser(userData).subscribe({
        next: (user) => {
          this.setCurrentUser(user);
          observer.next(user);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private setCurrentUser(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }
}
