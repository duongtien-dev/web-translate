import { Toaster } from 'sonner'
import { TranslateWorkspace } from './components/TranslateWorkspace'

function App() {
    return (
        <>
            <Toaster position="top-center" richColors closeButton />
            <TranslateWorkspace />
        </>
    )
}

export default App
