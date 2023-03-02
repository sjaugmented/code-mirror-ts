import './App.css'
import ts from 'typescript'
import lzstring from 'lz-string'
import {
	createDefaultMapFromCDN,
	createSystem,
	createVirtualCompilerHost,
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

		const globalTypes = `
		type Flow = {
			flowInfo: () => void;
			flowId: number;
		}
		const myFlow: Flow;
		let myTimeout: number;
		const myVersion: string;
		class Cat {
		  constructor(n: number);
		  readonly age: number;
		  purr(): void;
		}
		interface CatSettings {
		  weight: number;
		  name: string;
		  tailLength?: number;
		}
		type VetID = string | number;
		function checkCat(c: Cat, s?: VetID);
		`

		const filePrefix = `ts-lib-${ts.version}-lib.`
		const globalFilename = `globals.d.ts`

		fsMap.set(
			'index.ts',
			'/// <reference path="global.d.ts" />\nimport * from "path";\ninitialVal'
		)
		fsMap.set(globalFilename, globalTypes)
		localStorage.setItem(globalFilename, globalTypes)

		const system = createSystem(fsMap)
		const newEnv = createVirtualTypeScriptEnvironment(
			system,
			['index.ts', globalFilename],
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
