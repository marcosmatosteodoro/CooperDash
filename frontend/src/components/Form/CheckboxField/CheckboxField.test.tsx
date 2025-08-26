import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CheckboxField } from "./CheckboxField";
import type { CheckboxFieldProps } from "@/types/ui";

describe("CheckboxField", () => {
  const mockOnChange = jest.fn();

  const baseProps: CheckboxFieldProps = {
    field: {
      name: "terms",
      type: "checkbox",
      contentClassName: "form-check",
      tag: "checkbox",
      label: "Aceito os termos",
      checked: false,
      onChange: mockOnChange,
    },
    fieldErrors: null,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders a checkbox and its label", () => {
    render(<CheckboxField {...baseProps} />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByLabelText("Aceito os termos")).toBeInTheDocument();
  });

  it("respects the checked state", () => {
    const { rerender } = render(<CheckboxField {...baseProps} />);

    let checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    rerender(
      <CheckboxField
        {...baseProps}
        field={{ ...baseProps.field, checked: true }}
      />
    );

    checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox).toBeChecked();
  });

  it("calls onChange when clicked", () => {
    render(<CheckboxField {...baseProps} />);
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("returns empty fragment if field.tag is not 'checkbox'", () => {
    const { container } = render(
      <CheckboxField
        {...baseProps}
        field={{ ...baseProps.field, tag: "input" as any }}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
