import React from 'react'
import Login from './Login.jsx'
import MusicPlayer from './MusicPlayer.jsx'

function Home(props) {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)

    if(isLoggedIn){
        return(
            <MusicPlayer setIsLoggedIn={setIsLoggedIn}/>
        )
    }else{
        return (
            <Login setIsLoggedIn={setIsLoggedIn}/>
        )
    }
}

export default Home