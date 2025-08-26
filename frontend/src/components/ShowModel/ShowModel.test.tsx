// ShowModel.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { ShowModel } from "./ShowModel";

describe("ShowModel component", () => {
  const firstColumn = {
    title: "Informações Básicas",
    icon: "bi-file-text",
    contents: [
      { label: "Nome", value: "João da Silva" },
      { label: "Tipo", value: "Pessoa Física" },
    ],
  };

  const secondColumn = {
    title: "Contato",
    icon: "bi-telephone",
    contents: [
      { label: "Telefone", value: "(11) 99999-9999" },
      { label: "Email", value: "joao@email.com" },
    ],
  };

  it("renders the first column", () => {
    render(<ShowModel firstColumn={firstColumn} />);
    expect(screen.getByText("Informações Básicas")).toBeInTheDocument();
    expect(screen.getByText("Nome:")).toBeInTheDocument();
    expect(screen.getByText("João da Silva")).toBeInTheDocument();
  });

  it("renders the second column if provided", () => {
    render(<ShowModel firstColumn={firstColumn} secondColumn={secondColumn} />);
    expect(screen.getByText("Contato")).toBeInTheDocument();
    expect(screen.getByText("Telefone:")).toBeInTheDocument();
    expect(screen.getByText("(11) 99999-9999")).toBeInTheDocument();
    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText("joao@email.com")).toBeInTheDocument();
  });

  it("renders only the first column if secondColumn is not provided", () => {
    render(<ShowModel firstColumn={firstColumn} />);
    expect(screen.getByText("Informações Básicas")).toBeInTheDocument();
    expect(screen.queryByText("Contato")).toBeNull();
  });

  it("renders correct number of list items for each column", () => {
    render(<ShowModel firstColumn={firstColumn} secondColumn={secondColumn} />);
    const items = screen.getAllByRole("listitem");
    // 2 itens na primeira coluna + 2 itens na segunda coluna
    expect(items).toHaveLength(4);
  });
});
