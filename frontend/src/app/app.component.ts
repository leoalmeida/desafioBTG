import { Component, inject, OnInit, signal } from '@angular/core';
import { TitleService } from './services/title.service';
import { LoadingIndicator } from './core/loading-indicator/loading-indicator';
import { RouterOutlet } from '@angular/router';
import { Toolbar } from './core/toolbar/toolbar';
import { OrderService } from './orders/order.service';
import { LoadingService } from './core/loading-indicator/loading.service';
import { CustomerService } from './customers/customer.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoadingIndicator, Toolbar, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  protected readonly title = signal('');

  private titleService: TitleService = inject(TitleService);

  ngOnInit(): void {
    this.titleService.setTitle();   
  }

  updateViewByRole(): void {}
}
