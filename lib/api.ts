import {
  NonceChallenge,
  LoginResponse,
  Intent,
  RevokeIntentRequest,
  DocumentVerification,
  SearchByDocumentId,
  PinataMetadata,
  StorageNetwork,
  ErrorResponse,
} from "./types/api";

const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "";
};

const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("etherdoc-auth") : null;
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json().catch(() => ({
      message: `HTTP ${response.status}: ${response.statusText}`,
    }));
    const message = Array.isArray(errorData.message)
      ? errorData.message.join(", ")
      : errorData.message || errorData.error || `HTTP error ${response.status}`;
    throw new Error(message);
  }
  return response.json() as Promise<T>;
};

// Auth API
export const authApi = {
  async createNonce(address: string): Promise<NonceChallenge> {
    const res = await fetch(`${getApiBaseUrl()}/auth/nonce`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });
    return handleResponse<NonceChallenge>(res);
  },

  async verifySignature(message: string, signature: string): Promise<LoginResponse> {
    const res = await fetch(`${getApiBaseUrl()}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ message, signature }),
    });
    return handleResponse<LoginResponse>(res);
  },
};

// Document Intents API
export const intentsApi = {
  async prepareRegister(formData: FormData): Promise<Intent> {
    const res = await fetch(`${getApiBaseUrl()}/documents/intents/register`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
      credentials: "include",
      body: formData,
    });
    return handleResponse<Intent>(res);
  },

  async prepareRevoke(data: RevokeIntentRequest): Promise<Intent> {
    const res = await fetch(`${getApiBaseUrl()}/documents/intents/revoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return handleResponse<Intent>(res);
  },

  async prepareSupersede(formData: FormData): Promise<Intent> {
    const res = await fetch(`${getApiBaseUrl()}/documents/intents/supersede`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
      credentials: "include",
      body: formData,
    });
    return handleResponse<Intent>(res);
  },

  async submitSignature(intentId: string, signature: string): Promise<Intent> {
    const res = await fetch(`${getApiBaseUrl()}/documents/intents/${intentId}/signature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      credentials: "include",
      body: JSON.stringify({ signature }),
    });
    return handleResponse<Intent>(res);
  },

  async getIntent(intentId: string): Promise<Intent> {
    const res = await fetch(`${getApiBaseUrl()}/documents/intents/${intentId}`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
      credentials: "include",
    });
    return handleResponse<Intent>(res);
  },
};

// Document Verification & Storage Metadata API
export const documentsApi = {
  async getVerifiedDocument(documentId: string): Promise<DocumentVerification> {
    const res = await fetch(`${getApiBaseUrl()}/documents/${documentId}`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    });
    return handleResponse<DocumentVerification>(res);
  },

  async searchByDocumentId(data: SearchByDocumentId): Promise<DocumentVerification> {
    const res = await fetch(`${getApiBaseUrl()}/documents/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return handleResponse<DocumentVerification>(res);
  },

  async searchByFile(formData: FormData): Promise<DocumentVerification> {
    const res = await fetch(`${getApiBaseUrl()}/documents/search`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
      credentials: "include",
      body: formData,
    });
    return handleResponse<DocumentVerification>(res);
  },

  async listStoredFiles(network: StorageNetwork, groupId?: string): Promise<PinataMetadata> {
    const query = new URLSearchParams({ network });
    if (groupId) query.append("groupId", groupId);

    const res = await fetch(`${getApiBaseUrl()}/documents?${query.toString()}`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
      credentials: "include",
    });
    return handleResponse<PinataMetadata>(res);
  },

  async listStorageGroups(network: StorageNetwork): Promise<PinataMetadata> {
    const res = await fetch(`${getApiBaseUrl()}/documents/groups?network=${network}`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
      credentials: "include",
    });
    return handleResponse<PinataMetadata>(res);
  },

  async createStorageGroup(network: StorageNetwork, groupName: string): Promise<PinataMetadata> {
    const res = await fetch(`${getApiBaseUrl()}/documents/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      credentials: "include",
      body: JSON.stringify({ network, groupName }),
    });
    return handleResponse<PinataMetadata>(res);
  },
};
