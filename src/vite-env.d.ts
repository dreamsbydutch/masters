/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly DG_API_KEY?: string
	readonly VITE_DG_API_KEY?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
