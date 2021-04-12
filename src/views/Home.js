import React from 'react'
import '../styles/content.css'
import BlogEntryHome from '../components/BlogEntryHome'

function Home (){
    return(
        <div className="container">
        <h1 className="title">Latest Post</h1>
        <div>
                <div>
                    <BlogEntryHome/>
                </div>  
        </div>
       
        </div>
    )
}
export default Home