import axios from "axios"


// Change: Support an explicit production backend URL
const isProduction = import.meta.env.PROD;
// Using an environment variable is better for security and flexibility
const baseURL = isProduction 
    ? import.meta.env.VITE_API_BASE_URL 
    : "http://localhost:3000";

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

export async function register({ username, email, password }) {

    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        return response.data

    } catch (err) {

        console.log(err)

    }

}

export async function login({ email, password }) {

    try {

        const response = await api.post("/api/auth/login", {
            email, password
        })

        return response.data

    } catch (err) {
        console.log(err)
    }

}

export async function logout() {
    try {

        const response = await api.get("/api/auth/logout")

        return response.data

    } catch (err) {
        console.log(err)
    }
}

export async function getMe() {

    try {

        const response = await api.get("/api/auth/get-me")

        return response.data

    } catch (err) {
        console.log(err)
    }

}