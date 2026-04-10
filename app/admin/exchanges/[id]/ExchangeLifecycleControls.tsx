"use client";

import { useState } from "react";

const STATUS_OPTIONS = [
  "APPROVED",
  "REJECTED",
  "PICKUP_PENDING",
  "PICKUP_SCHEDULED",
  "PICKUP_COMPLETED",
  "ITEM_RECEIVED",
  "REPLACEMENT_PROCESSING",
  "REPLACEMENT_SHIPPED",
  "CLOSED",
];

const SHIPMENT_DIRECTIONS = ["REVERSE_PICKUP", "FORWARD_REPLACEMENT"];
const SHIPMENT_STATUSES = ["NOT_STARTED", "PENDING", "SCHEDULED", "IN_TRANSIT", "DELIVERED", "FAILED"];

export default function ExchangeLifecycleControls({ requestId }: { requestId: string }) {
  const [nextStatus, setNextStatus] = useState("APPROVED");
  const [adminNote, setAdminNote] = useState("");
  const [shipmentDirection, setShipmentDirection] = useState("REVERSE_PICKUP");
  const [shipmentStatus, setShipmentStatus] = useState("PENDING");
  const [carrier, setCarrier] = useState("");
  const [awb, setAwb] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [message, setMessage] = useState("");

  async function updateStatus() {
    const key = window.prompt("Enter admin key");
    if (!key) return;

    const response = await fetch(`/api/admin/exchange-requests/${requestId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": key,
      },
      body: JSON.stringify({ nextStatus, adminNote }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(data?.error || "Failed to update status");
      return;
    }

    setMessage(`Status updated to ${data?.request?.status || nextStatus}. Refresh to view latest values.`);
  }

  async function updateShipment() {
    const key = window.prompt("Enter admin key");
    if (!key) return;

    const response = await fetch(`/api/admin/exchange-requests/${requestId}/shipment`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": key,
      },
      body: JSON.stringify({ direction: shipmentDirection, status: shipmentStatus, carrier, awb, trackingUrl }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(data?.error || "Failed to update shipment");
      return;
    }

    setMessage(`Shipment updated for ${data?.shipment?.direction || shipmentDirection}. Refresh to view latest values.`);
  }

  return (
    <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <h3>Lifecycle Action Controls</h3>
      <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <label>
          Next Status
          <select value={nextStatus} onChange={(event) => setNextStatus(event.target.value)} style={{ display: "block", width: "100%" }}>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label>
          Admin Note
          <textarea value={adminNote} onChange={(event) => setAdminNote(event.target.value)} style={{ display: "block", width: "100%" }} />
        </label>
        <button type="button" onClick={updateStatus}>Apply Status</button>
      </div>

      <hr style={{ margin: "16px 0" }} />
      <h4>Update Shipment</h4>
      <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <label>
          Direction
          <select value={shipmentDirection} onChange={(event) => setShipmentDirection(event.target.value)} style={{ display: "block", width: "100%" }}>
            {SHIPMENT_DIRECTIONS.map((direction) => (
              <option key={direction} value={direction}>
                {direction}
              </option>
            ))}
          </select>
        </label>
        <label>
          Shipment Status
          <select value={shipmentStatus} onChange={(event) => setShipmentStatus(event.target.value)} style={{ display: "block", width: "100%" }}>
            {SHIPMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label>
          Carrier
          <input value={carrier} onChange={(event) => setCarrier(event.target.value)} style={{ display: "block", width: "100%" }} />
        </label>
        <label>
          AWB
          <input value={awb} onChange={(event) => setAwb(event.target.value)} style={{ display: "block", width: "100%" }} />
        </label>
        <label>
          Tracking URL
          <input value={trackingUrl} onChange={(event) => setTrackingUrl(event.target.value)} style={{ display: "block", width: "100%" }} />
        </label>
        <button type="button" onClick={updateShipment}>Save Shipment</button>
      </div>
      {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}
    </section>
  );
}
