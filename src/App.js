import React, { useEffect, useState } from "react"
import Tmdb from "./Tmdb"
import './App.css'
import MovieRow from "./components/MovieRow/index"
import FeaturedMovie from "./components/FeaturedMovie/index"
import Header from "./components/Header"

export default () => {

    const [movieList, setMovieList] = useState([])
    const [featureData, setFeatureData] = useState(null)
    const [blackHeader, setBlackHeader] = useState(false)

    useEffect(() => {
        const loadAll = async () => {
            //Pegar a lista total
            let list = await Tmdb.getHomeList()
            setMovieList(list)

            //Pegando o Featured
            let originals = list.filter(i=>i.slug === 'originals')
            let randomChosen  = Math.floor(Math.random() * (originals[0].items.results.length -1)) 
            let chosen = originals[0].items.results[randomChosen]
            let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')
            setFeatureData(chosenInfo)
        }
        loadAll()
    },[])

    useEffect(() => {
        const scrollListener = () => {
            if(window.scrollY > 10) {
                setBlackHeader(true)
            } else {
                setBlackHeader(false)
            }
        }
        
        window.addEventListener('scroll', scrollListener)

        return () => {
            window.removeEventListener('scroll', scrollListener)
        }
    },[])

    return (
        <div className="page">
            
            <Header black={blackHeader} />

            {featureData &&
                <FeaturedMovie item={featureData} />
            }

            <section className="lists">
                {movieList.map((item, key) => (
                    <MovieRow key={key} title={item.title} items={item.items}/>
                ))}
            </section>
            <footer>
                Feito na videoaula <a href={`https://www.youtube.com/watch?v=tBweoUiMsDg&t=4s`}>Bonieky Lacerda</a> no YouTube <br/>
                Agradecimentos ao Bonieky pelo ótimo conteúdo <br/>
                Direito de imagem para <a href="https://www.netflix.com/br/">Netflix</a><br/>
                Dados pegos pela API do site <a href="https://www.themoviedb.org/">Themoviedb.org</a>
            </footer>
            
            {movieList <= 0 && 
                <div className="loading">
                    <img src="https://rchandru.com/images/portfolio/modals/m-loading.gif" alt="Carregando" />
                </div>
            }
        </div>
    )
}