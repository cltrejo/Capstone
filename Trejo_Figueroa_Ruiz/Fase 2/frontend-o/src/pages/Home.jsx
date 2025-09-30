import { Header } from '../components/Header'
import { Room } from '../components/Icons';
import './Home.css'


export function Home (){
    
    return (
        <>
        <div className='content'>
            <header>
                <Header/>
            </header>
            <main>
                <Room />
            </main>
        </div>
        </>
    )
}

export default Home