import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { UserType } from "src/app/users/user-type";
import { NotificationService } from "src/app/services/notification.service";
import { TitleService } from "src/app/services/title.service";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { AuthService } from "src/app/login/auth.service";

@Component({
  selector: "app-admin-board",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: "./admin-board.html",
  styleUrls: ["./admin-board.css"],
})
export class AdminBoard implements OnInit {
  protected loggedUser = signal({} as UserType);
  protected readonly title = signal("");
  private titleService: TitleService = inject(TitleService);

  displayedColumns: string[] = ["id", "name", "actions"];

  private notify: NotificationService = inject(NotificationService);
  private tokenStorageService: TokenStorageService =
    inject(TokenStorageService);
  private authService: AuthService = inject(AuthService);
  dataSource = new MatTableDataSource<UserType>([]);

  constructor() {
    try {
      this.tokenStorageService.loggedUser$.subscribe((user) => {
        this.loggedUser.set(user);
      });
    } catch (error: any) {
      this.notify.showError(error.message || "Erro ao identificar usuário");
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle();
    this.dataSource.data = this.authService.items();
  }

  removeUser(id: number) {
    this.dataSource.data = this.dataSource.data.filter(
      (user) => user.id !== id,
    );

    this.notify.showSuccess("Usuário removido com sucesso!", {
      duration: 3000,
    });
  }
}
