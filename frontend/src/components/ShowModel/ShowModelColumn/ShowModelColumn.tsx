import React from "react";
import type { ShowModelColumnProps } from "@/types/ui";

export const ShowModelColumn: React.FC<ShowModelColumnProps> = ({ title, icon, contents }) => (
  <div className="col-md-6">
    <div className="mb-3">
      <h5 className="text-muted mb-3">
        <i className={`bi ${icon} me-2`}></i>
        { title }
      </h5>
      <ul className="list-group list-group-flush">
        { contents.map((content, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-start gap-2">
            <span className="fw-bold">{content.label}:</span>
            <span>{content.value}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);