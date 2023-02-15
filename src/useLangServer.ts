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
	const [fsMap, setFsMap] = useState<Map<string, string>>()
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
		const content = 'const foo = "Hello World".'
		fsMap.set('index.ts', content)

		const system = createSystem(fsMap)

		const compilerOpts = {}
		const newEnv = createVirtualTypeScriptEnvironment(
			system,
			['index.ts'],
			ts,
			compilerOpts
		)

		setEnv(newEnv)
		setFsMap(fsMap)
	}

	if (!loaded.current) {
		load()
	}

	return { env, fsMap }
}
