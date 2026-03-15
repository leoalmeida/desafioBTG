import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OrderCard } from "./order-card";
import { OrderService } from "../order.service";
import { NotificationService } from "src/app/services/notification.service";
import { MatDialogModule } from "@angular/material/dialog";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TemplateRef } from "@angular/core";
import { OrderType } from "../order-type";
import { of } from "rxjs";
import { createSpyObj, SpyObj } from "../../../test-helpers/spy-utils";
import { makeOrder } from "../../../test-helpers/domain-fixtures";

describe("OrderCard", () => {
  let component: OrderCard;
  let fixture: ComponentFixture<OrderCard>;
  let orderServiceSpy: SpyObj<OrderService>;
  let notificationServiceSpy: SpyObj<NotificationService>;
  let dialogOpenSpy: ReturnType<typeof vi.fn>;

  const mockOrder: OrderType = {
    ...makeOrder({ id: 1, customerId: 99, itemList: [] }),
  };

  beforeEach(async () => {
    orderServiceSpy = createSpyObj<OrderService>([
      "changeOne",
      "createOne",
      "removeOne",
    ]);
    (orderServiceSpy.changeOne as any).mockReturnValue(of(true));
    (orderServiceSpy.createOne as any).mockReturnValue(of(true));
    notificationServiceSpy = createSpyObj<NotificationService>([
      "showSuccess",
      "showError",
    ]);

    await TestBed.configureTestingModule({
      imports: [OrderCard, MatDialogModule, NoopAnimationsModule],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderCard);
    component = fixture.componentInstance;
    dialogOpenSpy = vi.fn().mockReturnValue({
      afterClosed: () => of(true),
    });
    (component as any).dialogAcao = { open: dialogOpenSpy };

    // Set required input
    fixture.componentRef.setInput("order", mockOrder);
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve salvar pedido existente com changeOne", () => {
    component.onSaveOrder({} as TemplateRef<any>);

    expect(dialogOpenSpy).toHaveBeenCalled();
    expect(orderServiceSpy.changeOne).toHaveBeenCalledWith(mockOrder);
  });

  it("deve remover pedido quando confirmado", () => {
    component.onRemoveOrder({} as TemplateRef<any>);

    expect(dialogOpenSpy).toHaveBeenCalled();
    expect(orderServiceSpy.removeOne).toHaveBeenCalledWith(1);
  });
});
