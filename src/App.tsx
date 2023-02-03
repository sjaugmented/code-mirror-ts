import { javascript } from '@codemirror/lang-javascript'
import './App.css'
import ReactCodeMirror from '@uiw/react-codemirror'
import { useLangServer } from 'useLangServer'
import { Editor } from '@prisma/text-editors'
import { useState } from 'react'

function App() {
	const [code, setCode] = useState('')
	const env = useLangServer()

	return (
		<>
			<ReactCodeMirror
				extensions={[javascript()]}
				height={'500px'}
				basicSetup={{ autocompletion: true }}
			/>
			<Editor lang='ts' value={code} onChange={setCode} />
		</>
	)
}

export default App
