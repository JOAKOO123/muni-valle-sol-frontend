'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/useAuthStore'
import { login as loginService, register as registerService } from '@/services/authService'

type Tab = 'login' | 'register'

const LoginPage = () => {
  const router = useRouter()
  const { login } = useAuthStore()

  const [tab, setTab]                           = useState<Tab>('login')
  const [email, setEmail]                       = useState('')
  const [password, setPassword]                 = useState('')
  const [confirmPassword, setConfirmPassword]   = useState('')
  const [error, setError]                       = useState('')
  const [loading, setLoading]                   = useState(false)

  const isLogin = tab === 'login'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isLogin && password !== confirmPassword) {
      setError('Las contrasenas no coinciden')
      return
    }

    setLoading(true)
    try {
      if (isLogin) {
        const data = await loginService(email, password)
        login(data.token, { id: data.id, email: data.email, nombre: email.split('@')[0], rol: data.rol || 'CIUDADANO' })
        router.push('/dashboard')
      } else {
        await registerService(email, password)
        setTab('login')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrio un error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Tabs */}
        <div className={`flex rounded-t-2xl overflow-hidden transition-colors duration-300 ${
          isLogin ? 'bg-gray-900' : 'bg-white'
        }`}>
          <button
            onClick={() => { setTab('login'); setError('') }}
            className={`flex-1 py-4 text-sm font-semibold transition-all ${
              isLogin
                ? 'text-white border-b-2 border-white'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Iniciar sesion
          </button>
          <button
            onClick={() => { setTab('register'); setError('') }}
            className={`flex-1 py-4 text-sm font-semibold transition-all ${
              !isLogin
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Form */}
        <div className={`rounded-b-2xl shadow-xl p-8 transition-colors duration-300 ${
          isLogin ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}>
          <h1 className="text-2xl font-bold mb-6">
            {isLogin ? 'Bienvenido de vuelta' : 'Crear cuenta'}
          </h1>

          {error && (
            <div className={`mb-4 px-4 py-3 rounded-lg text-sm border ${
              isLogin
                ? 'bg-red-900/30 border-red-500/30 text-red-400'
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className={`text-xs font-semibold uppercase tracking-wide ${
                isLogin ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Email
              </label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`px-4 py-2.5 rounded-lg text-sm outline-none border transition-colors ${
                  isLogin
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-900'
                }`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className={`text-xs font-semibold uppercase tracking-wide ${
                isLogin ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Contrasena
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`px-4 py-2.5 rounded-lg text-sm outline-none border transition-colors ${
                  isLogin
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-900'
                }`}
              />
            </div>

            {!isLogin && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Confirmar contrasena
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="px-4 py-2.5 rounded-lg text-sm outline-none border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-900 bg-white transition-colors"
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  Guardar sesion
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-400 hover:text-blue-300 transition"
                >
                  Olvidaste tu contrasena?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`mt-2 py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                isLogin
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {loading
                ? 'Cargando...'
                : isLogin ? 'Iniciar sesion' : 'Crear cuenta'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )

}

export default LoginPage

