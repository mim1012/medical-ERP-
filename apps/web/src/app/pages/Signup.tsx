import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { apiClient } from '../../lib/api-client'

interface SignupForm {
  name: string
  orgName: string
  email: string
  password: string
}

export function Signup() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>()

  const onSubmit = async (data: SignupForm) => {
    setError(null)
    setIsLoading(true)
    try {
      await apiClient.post('/auth/signup', {
        email: data.email,
        password: data.password,
        name: data.name,
        orgName: data.orgName,
      })
      await signIn(data.email, data.password)
      navigate('/', { replace: true })
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } }
        setError(axiosErr.response?.data?.message ?? '회원가입에 실패했습니다')
      } else {
        setError(err instanceof Error ? err.message : '회원가입에 실패했습니다')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center">
      <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm p-8 w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#18212B]">의료기기 ERP</h1>
          <p className="text-sm text-[#5B6773] mt-1">새 계정을 만들어 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#18212B] mb-1">이름</label>
            <input
              type="text"
              {...register('name', { required: '이름을 입력하세요' })}
              className="w-full px-3 py-2.5 border border-[#D7DEE6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
              placeholder="홍길동"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#18212B] mb-1">조직명</label>
            <input
              type="text"
              {...register('orgName', { required: '조직명을 입력하세요' })}
              className="w-full px-3 py-2.5 border border-[#D7DEE6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
              placeholder="메디컬 주식회사"
            />
            {errors.orgName && <p className="text-xs text-red-500 mt-1">{errors.orgName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#18212B] mb-1">이메일</label>
            <input
              type="email"
              {...register('email', { required: '이메일을 입력하세요' })}
              className="w-full px-3 py-2.5 border border-[#D7DEE6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
              placeholder="admin@example.com"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#18212B] mb-1">비밀번호</label>
            <input
              type="password"
              {...register('password', { required: '비밀번호를 입력하세요', minLength: { value: 6, message: '비밀번호는 6자 이상이어야 합니다' } })}
              className="w-full px-3 py-2.5 border border-[#D7DEE6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#163A5F] text-white rounded-md text-sm font-semibold hover:bg-[#0F2942] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '처리 중...' : '회원가입'}
          </button>
        </form>

        <p className="text-center text-sm text-[#5B6773] mt-6">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-[#163A5F] font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
