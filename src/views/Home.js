import React, {useEffect} from 'react'
import Header from '../components/Header'
import NavBarMain from '../components/NavBarMain'
import FooterMain from '../components/FooterMain'
import {firebaseAnalytics} from '../firebase/firebase'

function Home (){

    useEffect(() => {
        try{
            firebaseAnalytics.logEvent("page_view")
        }catch{
            return null;
        }
        
    }, [])

    return(
        <>
       
            <Header/>
            <NavBarMain/>
            <h1 className="title">Latest Post</h1>
            <FooterMain/>
        </>
      
    
    )
}
export default Home