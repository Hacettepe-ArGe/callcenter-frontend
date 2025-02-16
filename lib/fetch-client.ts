import { redirect } from 'next/navigation'

export async function fetchClient(
  url: string, 
  options: RequestInit = {}
) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (response.status === 401) {
      // Clear any auth state if needed
      redirect('/signin')
    }

    return response
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
} 