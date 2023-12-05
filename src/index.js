// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
// import "bootstrap/dist/css/bootstrap.min.css";
// import reportWebVitals from "./reportWebVitals";
// import { Provider } from "react-redux";
// import { configureStore } from "@reduxjs/toolkit";
// import UserReducer from "./components/20-day_27_june/redux/Reducer/UserReducer";



// const store = configureStore({
//   reducer:UserReducer
// })

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

// const token = 

// const client =  new ApolloClient({
//   uri : 'https://menspal.com/graphql',
//   cache : new InMemoryCache(),
//   headers: {
//    authorization: token ? `Bearer ${token}` : "",
//     pip: '49.43.34.203',
//     plp: 'menu-online',
//     Tz: 'Asia/Calcutta'
//   },
// })

const client = new ApolloClient({
  uri: "https://menspal.com/graphql", // Use 'uri' instead of 'url'
  cache: new InMemoryCache(),
  headers: {
    authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJpc19zaWduYWdlX2FjY2VzcyI6dHJ1ZSwiaXNfd2lmaV9hY2Nlc3MiOnRydWUsImlzX21hcmtldGluZ19hY2Nlc3MiOnRydWUsImlzX21lbnVfb25saW5lX2FjY2VzcyI6dHJ1ZSwiaXNfc2NoZWR1bGVfYWNjZXNzIjp0cnVlLCJpc19sb3lhbHR5X3Byb2dyYW1fYWNjZXNzIjp0cnVlLCJpc19yZXB1dGF0aW9uX2FjY2VzcyI6dHJ1ZSwiY2xpZW50X2lkIjoiMiIsInVzZXJfZGF0YSI6InBpenplcmFnZXJybiIsInVzZXJfdHlwZSI6ImFkbWluIiwidXNlcl9pcF9hZGRyZXNzIjoiNDkuNDMuMzQuMjIxIiwiaWF0IjoxNzAxMjQ3NDQ0LCJleHAiOjI0MjEyNDc0NDR9.EjbFQC52cuh5H2zv8bo53hGiTpn9eD-NnL6kYMX_CdI',
    Pip: '49.43.33.237',
    Plp: 'menu-online',
    Tz: 'Asia/Calcutta'
  }
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
 <ApolloProvider  client={client} > 
    <App />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();