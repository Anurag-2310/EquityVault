import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_BASE_URL ||
        "https://equityvault-production.up.railway.app/api",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

export const getCompanies = async () => {
    const response = await api.get("/companies");
    return response.data;
};

export const getCompany = async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
};

export const getCorporateActions = async (params = {}) => {
    const response = await api.get("/corporate-actions", {
        params,
    });
    return response.data;
};

export const getDividends = async (params = {}) => {
    const response = await api.get("/dividends", {
        params,
    });
    return response.data;
};

export const getIpos = async (params = {}) => {
    const response = await api.get("/ipos", {
        params,
    });
    return response.data;
};

export const getIpo = async (id) => {
    const response = await api.get(`/ipos/${id}`);
    return response.data;
};

export const askAiVault = async (question, holdings = []) => {
    const response = await api.post("/ai/ask", {
        question,
        holdings,
    });
    return response.data;
};

export const getDocuments = async (params = {}) => {
    const response = await api.get("/documents", {
        params,
    });
    return response.data;
};

export const getDocument = async (id) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
};

export default api;