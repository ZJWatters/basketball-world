import { useRouter } from 'next/router'

export default function BackButton({ to = '/', className = '' }) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push(to)}
      className={`absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 text-gray-700 shadow hover:bg-gray-500 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  )
}
