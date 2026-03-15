import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from "@angular/core";
import {
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from "@angular/common/http";
import {
  provideClientHydration,
  withIncrementalHydration,
} from "@angular/platform-browser";
import { provideRouter, withViewTransitions } from "@angular/router";
import { routes } from "./app.routes";
import { environment } from "../environments/environment";

export const appInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.production) {
    console.log("Request made with URL:", req.url);
  }
  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([appInterceptor]), // loggingInterceptor, cachingInterceptor
    ),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideClientHydration(withIncrementalHydration()),
  ],
};
