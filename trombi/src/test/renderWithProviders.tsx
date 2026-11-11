import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import ThemeProvider from "../contexts/ThemeProvider.tsx";
import { makeStore } from "../store/index.ts";
import type { RootState } from "../store/index.ts";

interface Options {
  route?: string;
  preloadedState?: Partial<RootState>;
}

export function renderWithProviders(
  ui: ReactElement,
  { route = "/", preloadedState }: Options = {},
) {
  const store = makeStore(preloadedState);
  const result = render(
    <Provider store={store}>
      <ThemeProvider>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </ThemeProvider>
    </Provider>,
  );
  return { store, ...result };
}
