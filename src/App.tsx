import React, { useState } from "react"
import { base64Decode } from "./base64Decode"

type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

type DiscohookData = {
	messages: {
		data: Record<string, Json> & {
			embeds?: {
				thumbnail?: {
					url: string
					proxy_url?: string
					width?: string
					height?: string
				}
				image?: {
					url: string
					proxy_url?: string
					width?: string
					height?: string
				}
				timestamp?: string
			}[]
			files?: Json
		}
	}[]
}

const linkStyle =
	"underline text-blue-400 hover:text-blue-200 transition-colors"

const codeStyle = "bg-coolGray-900 p-1 rounded"

function App() {
	const [url, setUrl] = useState("")
	const [shareLink, setShareLink] = useState(false)

	const handleInput = async (ev: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = ev.target

		const fullRegex = /^https?:\/\/discohook.(org|app)\/\?data=[A-z0-9\_\-]+$/
		const shareRegex =
			/^https?:\/\/share.discohook.(org|app)\/go\/[A-z0-9\_\-]+$/

		if (fullRegex.test(value)) {
			setUrl(value)
			setShareLink(false)
		} else if (shareRegex.test(value)) {
			setUrl("")
			setShareLink(true)
		} else {
			setUrl("")
			setShareLink(false)
		}
	}

	function decodeB64(url: string): DiscohookData | undefined {
		const [data] = url.match(/[A-z0-9\_\-]+$/) ?? []
		try {
			return JSON.parse(base64Decode(data))
		} catch {}
	}

	function cleanMessage(m: DiscohookData["messages"][number]["data"]) {
		m.embeds = m.embeds?.map((e) => {
			if (e.image) e.image = { url: e.image.url }
			if (e.thumbnail) e.thumbnail = { url: e.thumbnail.url }
			if (e.timestamp) e.timestamp = new Date(e.timestamp).toISOString()
			return e
		})

		const { files, ...message } = m

		return message
	}

	return (
		<div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-4 text-coolGray-300 py-16 px-6">
			<h1 className="font-bold text-3xl text-center flex gap-4 items-center">
				Discoaid
			</h1>
			<p className="w-full">
				There is an issue with Discohook that causes some links to lead to a 520
				error page.
			</p>
			<p className="w-full">
				You can give an editor link on the text box below to get its JSON data,
				separated by message. Paste this data in the <b>JSON Data Editor</b> on{" "}
				<a className={linkStyle} href="https://discohook.org/">
					Discohook
				</a>
				, replace all of its contents.
			</p>
			<p className="w-full">
				If you need help, hop into our{" "}
				<a className={linkStyle} href="https://discohook.org/discord">
					Support Server
				</a>
				. Source code for this site is on{" "}
				<a className={linkStyle} href="https://github.com/Crawron/discoaid">
					GitHub
				</a>
				.
			</p>
			<label className="w-full">
				<span className="font-bold text-coolGray-400 inline-block pb-1">
					URL
				</span>
				<input
					type="text"
					name="url"
					placeholder="https://discohook.org/?data=..."
					className="w-full h-9 px-2 rounded border border-black bg-coolGray-900 transition placeholder-coolGray-500 placeholder-shown:italic focus:ring-2 ring-blue-500"
					onChange={handleInput}
				/>
			</label>

			{url &&
				(decodeB64(url)?.messages.map(({ data: m }, i) => (
					<textarea
						key={i}
						className="w-full h-96 p-4 rounded border-black bg-coolGray-900 font-mono"
						value={JSON.stringify(cleanMessage(m), null, 2)}
						readOnly
					/>
				)) ?? (
					<p className="w-full text-red-500 font-semibold">Failed decoding</p>
				))}

			{shareLink && (
				<>
					<p className="w-full">
						This is a shortened url, visit it and wait for it to redirect you.
						Then copy the long URL it leads to and paste it above.
					</p>
					<p className="w-full">
						It should start with either{" "}
						<code className={codeStyle}>https://discohook.org/</code> or{" "}
						<code className={codeStyle}>https://discohook.app/</code>
					</p>
				</>
			)}
		</div>
	)
}

export default App
