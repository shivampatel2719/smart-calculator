import axios from "axios";

const AUDIT_ENDPOINT_URL = "https://k2d8tyukj2.execute-api.us-east-1.amazonaws.com/audit";

function getEventId() {
  const stored = localStorage.getItem("eventId");
  return stored ? parseInt(stored, 10) : 1;
}

function incrementEventId() {
  const current = getEventId();
  const next = current + 1;
  localStorage.setItem("eventId", next.toString());
  return current;
}

export function logAuditEvent(action, value) {
  const event = {
    id: incrementEventId(),
    timestamp: Math.floor(Date.now() / 1000).toString(),
    action,
    value
  };

  const auditQueue = JSON.parse(localStorage.getItem("auditQueue") || "[]");
  auditQueue.push(event);
  localStorage.setItem("auditQueue", JSON.stringify(auditQueue));
  event["httpMethod"] = "POST";
  axios.post(AUDIT_ENDPOINT_URL, event, {
    headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
      const remainingQueue = auditQueue.filter(e => e.id !== event.id);
      localStorage.setItem("auditQueue", JSON.stringify(remainingQueue));
    })
    .catch((err) => {
      console.error("Failed to send audit event", event, err);
    });
}

export async function fetchAuditLogs(limit = 50, startFrom = null) {
  try {
    let url = `${AUDIT_ENDPOINT_URL}?limit=${limit}`;
    if (startFrom) {
      url += `&startFrom=${startFrom}`;
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    throw error;
  }
}
