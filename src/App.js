// import React from "react";

// // import News from "./components/22-day_29_june/axios/News";





// export default function App() {
//   return (
//     <div>
//       {/* <News/> */}
//     </div>
//   )
// }


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShowFloorList from './Componets/ShowFloorList';

import AddTableForm from './Componets/AddEditTable';
import AddFloorForm from './Componets/AddEditFloor';
import EditFloorForm from './Componets/AddEditFloor';
import TableList from './Componets/ShowTableList';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShowFloorList />} />
        <Route path="/AddFloorForm" element={<AddFloorForm />} />
        <Route path="/AddFloorForm/:id" element={<EditFloorForm />} /> {/* Dynamic route for editing */}
        <Route path="/AddTableForm" element={<AddTableForm />} />
        <Route path="/AddTableForm/:id" element={<AddTableForm />} />
        <Route path="/TableList/:id" element={<TableList />} />
      </Routes>
    </Router>
  );
}

export default App;
