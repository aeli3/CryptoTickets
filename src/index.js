import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MyTickets from './routes/MyTickets';
import theme from './theme'
import './theme/styles.css'
import Search from './routes/Search';
import CreateEvents from './routes/CreateEvents';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element = {<App />} />
          <Route path='/mytickets' element = {<MyTickets/>} />
          <Route path="/create/events" element={<CreateEvents/>} /> 
          <Route path='/search' element = {<Search/>} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
