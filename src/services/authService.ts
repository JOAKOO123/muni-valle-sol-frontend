const BASE_URL = process.env.NEXT_PUBLIC_BFF_URL

export const login = async (email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!response.ok) {
    throw new Error('Credenciales incorrectas')
  }
  return response.json()
}

export const register = async (email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!response.ok) throw new Error('Error al registrar usuario')
  return response.json()
}
