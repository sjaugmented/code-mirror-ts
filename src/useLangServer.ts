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
		const compilerOpts = {
			target: ts.ScriptTarget.ES2021,
		}
		const fsMap = await createDefaultMapFromCDN(
			compilerOpts,
			ts.version,
			true,
			ts,
			lzstring
		)

		const flowHelpers = `
		export type Flow = {
			status: 'Active' | 'Suspended'
		};
		`

		const version = '4.9.5'
		const filePrefix = `ts-lib/typescript/${version}`

		fsMap.set('index.ts', 'intialValue')
		fsMap.set(`${filePrefix}/index.d.ts`, flowHelpers)
		localStorage.setItem(`${filePrefix}/index.d.ts`, flowHelpers)

		const system = createSystem(fsMap)
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
