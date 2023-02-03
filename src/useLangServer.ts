import './App.css'
import ts from 'typescript'
import lzstring from 'lz-string'
import {
	createDefaultMapFromCDN,
	createSystem,
	createVirtualTypeScriptEnvironment,
	VirtualTypeScriptEnvironment,
} from '@typescript/vfs'
import { useRef, useState } from 'react'

export function useLangServer() {
	const [env, setEnv] = useState<VirtualTypeScriptEnvironment>()
	const loaded = useRef(false)

	async function load() {
		loaded.current = true
		const fsMap = await createDefaultMapFromCDN(
			{},
			ts.version,
			true,
			ts,
			lzstring
		)
		fsMap.set('index.ts', 'const foo = "Hello World"')

		const system = createSystem(fsMap)

		const compilerOpts = {}
		const newEnv = createVirtualTypeScriptEnvironment(
			system,
			['index.ts'],
			ts,
			compilerOpts
		)

		setEnv(newEnv)
	}

	if (!loaded.current) {
		load()
	}

	console.log(env?.languageService)

	return env
}
