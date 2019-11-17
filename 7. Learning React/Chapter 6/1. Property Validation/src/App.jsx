import React from 'react';
import logo from './logo.svg';
import Summary from "./Summary";
import './App.css';

function App() {
    return (
        <article>
            <header>
                <h1>Delicious Recipes</h1>
            </header>
            <Summary title="Peanut Butter and Jelly"
                     ingredients={3}
                     steps={4}/>
             <Summary></Summary>
        </article>
    );
}

export default App;
