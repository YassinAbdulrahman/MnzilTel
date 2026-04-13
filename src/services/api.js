const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8001").replace(/\/$/, "");

async function parseJsonResponse(response) {
  const data = await response.json().catch(() => null);

  if (response.ok) {
    return data;
  }

  if (data?.message) {
    throw new Error(data.message);
  }

  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    throw new Error(data.detail[0]?.msg ?? "Request failed");
  }

  throw new Error("Request failed");
}

async function request(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  return parseJsonResponse(response);
}

export const api = {
  getWallet: async () => {
    const data = await request("/wallet");
    return data.wallet;
  },

  getPlan: async () => {
    return request("/plan");
  },

  getUsage: async () => {
    return request("/usage");
  },

  topUp: async ({ phone, bundle }) => {
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("bundle", bundle);

    return request("/topup", {
      method: "POST",
      body: formData,
    });
  },

  activateESIM: async ({ iccid, name, nationality, selfie }) => {
    const formData = new FormData();
    formData.append("iccid", iccid);
    formData.append("name", name);
    formData.append("nationality", nationality);
    formData.append("selfie", selfie);

    return request("/activate-esim", {
      method: "POST",
      body: formData,
    });
  },
};
