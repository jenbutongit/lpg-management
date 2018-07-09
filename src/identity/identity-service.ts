import axios from 'axios'

function create(token: string) {
	const http = axios.create({
		baseURL: 'http://localhost:8080',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		timeout: 5000,
	})

	return http
}

export async function getDetails(token: string) {
	const http = create(token)
	const response = await http.get(`/oauth/resolve`)
	return response.data
}
