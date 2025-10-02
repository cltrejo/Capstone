import { Header } from '../components/Header'
import { NotFoundIcon } from '../components/Icons'
import './NotFound.css'

export function NotFound(){
    return (
        <>
        <div className='notfound'>
            <header>
                <Header/>
            </header>
            <main>
                <NotFoundIcon />
            </main>
        </div>
        </>
    )
}

export default NotFound