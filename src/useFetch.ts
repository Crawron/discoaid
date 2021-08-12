import { useEffect, useState } from "react"

export function useFetch(url: string, method = "GET", delay = 500) {
	const [delayedUrl, setDelayedUrl] = useState<string | null>(null)
	const [response, setResponse] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (delayedUrl) return () => setDelayedUrl(null)

		const tiemoutId = setTimeout(() => setDelayedUrl(url), delay)

		return () => clearTimeout(tiemoutId)
	}, [url, delayedUrl, delay])

	useEffect(() => {
		try {
			if (delayedUrl) {
				fetch(delayedUrl, { method })
					.then((response) => {
						response
							.text()
							.then(setResponse)
							.catch((reason) => setError(reason.message))
					})
					.catch((reason) => setError(reason.message))
			}
		} catch (e) {
			setError(e)
		}

		return () => {
			setResponse(null)
			setError(null)
		}
	}, [method, delayedUrl])

	return [response, error]
}
