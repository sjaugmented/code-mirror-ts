import { javascript } from '@codemirror/lang-javascript'
import './App.css'
import ReactCodeMirror from '@uiw/react-codemirror'
import { useLangServer } from 'useLangServer'
import { Editor } from '@prisma/text-editors'
import { useState } from 'react'
import {
	autocompletion,
	completeFromList,
	CompletionContext,
	CompletionResult,
} from '@codemirror/autocomplete'

function App() {
	const [code, setCode] = useState('')
	const { env, fsMap } = useLangServer()

	function handleChange(val: string) {
		fsMap?.set('index.ts', val)
	}

	const completionSource = async (
		ctx: CompletionContext
	): Promise<CompletionResult | null> => {
		const { pos } = ctx

		try {
			const completions = env?.languageService.getCompletionsAtPosition(
				'index.ts',
				pos,
				{}
			)
			if (!completions) {
				console.log('Unable to get completions', { pos })
				return null
			}

			return completeFromList(
				completions.entries.map((c, i) => ({
					type: c.kind,
					label: c.name,
					boost: 1 / Number(c.sortText),
				}))
			)(ctx)
		} catch (e) {
			console.log('Unable to get completions', { pos, error: e })
			return null
		}
	}

	return (
		<>
			<ReactCodeMirror
				extensions={[
					javascript(),
					autocompletion({
						activateOnTyping: true,
						maxRenderedOptions: 30,
						override: [completionSource],
					}),
				]}
				height={'500px'}
				basicSetup={{ autocompletion: true }}
				onChange={handleChange}
			/>
			<Editor lang='ts' value={code} onChange={setCode} />
		</>
	)
}

export default App
