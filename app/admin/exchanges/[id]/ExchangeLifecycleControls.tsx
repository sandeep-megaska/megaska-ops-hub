"use client";

import { useState } from "react";

const SHIPMENT_DIRECTIONS = ["REVERSE_PICKUP", "FORWARD_REPLACEMENT"];
const SHIPMENT_STATUSES = ["NOT_STARTED", "PENDING", "SCHEDULED", "IN_TRANSIT", "DELIVERED", "FAILED"];

type Props = {
  requestId: string;
  currentStatus: string;
  allowedTransitions: string[];
  currentAdminNote: string;
};

export default function ExchangeLifecycleControls({ requestId, currentStatus, allowedTransitions, currentAdminNote }: Props) {
  const [adminKey, setAdminKey] = useState("");
  const [nextStatus, setNextStatus] = useState(allowedTransitions[0] || currentStatus);
  const [adminNote, setAdminNote] = useState(currentAdminNote);
  const [shipmentDirection, setShipmentDirection] = useState("REVERSE_PICKUP");
  const [shipmentStatus, setShipmentStatus] = useState("PENDING");
  const [carrier, setCarrier] = useState("");
  const [awb, setAwb] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [pickupAt, setPickupAt] = useState("");
  const [shippedAt, setShippedAt] = useState("");
  const [deliveredAt, setDeliveredAt] = useState("");
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");

  async function updateStatus() {
    if (!adminKey) {
      setMessage("Admin key is required");
      return;
    }

    const response = await fetch(`/api/admin/exchange-requests/${requestId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
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

  async function saveNote() {
    if (!adminKey) {
      setMessage("Admin key is required");
      return;
    }

    const response = await fetch(`/api/admin/exchange-requests/${requestId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ adminNote }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(data?.error || "Failed to save admin note");
      return;
    }

    setMessage(data?.message || "Admin note saved. Refresh to view latest values.");
  }

  async function updateShipment() {
    if (!adminKey) {
      setMessage("Admin key is required");
      return;
    }

    const response = await fetch(`/api/admin/exchange-requests/${requestId}/shipment`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({
        direction: shipmentDirection,
        status: shipmentStatus,
        carrier,
        awb,
        trackingUrl,
        pickupAt: pickupAt || null,
        shippedAt: shippedAt || null,
        deliveredAt: deliveredAt || null,
        remarks,
      }),
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
      <div style={{ display: "grid", gap: 8, maxWidth: 500 }}>
        <label>
          Admin Key
          <input value={adminKey} onChange={(event) => setAdminKey(event.target.value)} style={{ display: "block", width: "100%" }} />
        </label>
      </div>
      <div style={{ display: "grid", gap: 8, maxWidth: 500, marginTop: 8 }}>
        <label>
          Current Status
          <input value={currentStatus} disabled style={{ display: "block", width: "100%" }} />
        </label>
        <label>
          Next Status
          <select value={nextStatus} onChange={(event) => setNextStatus(event.target.value)} style={{ display: "block", width: "100%" }}>
            {(allowedTransitions.length ? allowedTransitions : [currentStatus]).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={updateStatus} disabled={!allowedTransitions.length}>Apply Status</button>
      </div>

      <hr style={{ margin: "16px 0" }} />
      <h4>Internal Admin Note</h4>
      <div style={{ display: "grid", gap: 8, maxWidth: 500 }}>
        <label>
          Admin Note
          <textarea value={adminNote} onChange={(event) => setAdminNote(event.target.value)} style={{ display: "block", width: "100%" }} />
        </label>
        <button type="button" onClick={saveNote}>Save Note</button>
      </div>

      <hr style={{ margin: "16px 0" }} />
      <h4>Update Shipment</h4>
      <div style={{ display: "grid", gap: 8, maxWidth: 500 }}>
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
          Tracking Number / AWB
          <input value={awb} onChange={(event) => setAwb(event.target.value)} style={{ display: "block", width: "100%" }} />
        </label>
        <label>
          Tracking URL
          <input value={trackingUrl} onChange={(event) => setTrackingUrl(event.target.value)} style={{ display: "block", width: "100%" }} />
        </label>
        <label>
          Pickup Date
          <input type="datetime-local" value={pickupAt} onChange={(event) => setPickupAt(event.target.value)} style={{ display: "block", width: "100%" }} />
        </label>
        <label>
          Shipped Date
          <input type="datetime-local" value={shippedAt} onChange={(event) => setShippedAt(event.target.value)} style={{ display: "block", width: "100%" }} />
        </label>
        <label>
          Delivered Date
          <input type="datetime-local" value={deliveredAt} onChange={(event) => setDeliveredAt(event.target.value)} style={{ display: "block", width: "100%" }} />
        </label>
        <label>
          Shipment Remarks
          <textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} style={{ display: "block", width: "100%" }} />
        </label>
        <button type="button" onClick={updateShipment}>Save Shipment</button>
      </div>
      {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}
    </section>
  );
}
