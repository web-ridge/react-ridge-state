import * as React from "react";
import { newRidgeState } from "../index";
import { getNodeText, render, waitFor } from "@testing-library/react";

export interface RouterState {
  page: "pageOne" | "pageTwo" | "pageThree";
}

const { set, useValue, useSelector } = newRidgeState<RouterState>({
  page: "pageOne",
});

function push(page: RouterState["page"]) {
  set({ page });
}

function Issue5Component() {
  const page = useSelector((s) => s.page);

  return (
    <>
      <span data-testid={"current-page"}>
        {page === "pageOne" && "One"}
        {page === "pageTwo" && "Two"}
        {page === "pageThree" && "Three"}
      </span>
    </>
  );
}

test("Selector sucessfully re-renders on change", async () => {
  // test react hooks
  const issue5Component = render(<Issue5Component />);
  const getValue = (): string => {
    return getNodeText(issue5Component.queryByTestId("current-page"));
  };
  await waitFor(() => expect(getValue()).toBe("One"));
  push("pageTwo");
  await waitFor(() => expect(getValue()).toBe("Two"));
  push("pageThree");
  await waitFor(() => expect(getValue()).toBe("Three"));
  push("pageOne");
  await waitFor(() => expect(getValue()).toBe("One"));
});
