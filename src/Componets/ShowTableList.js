// import { useEffect, useState } from "react";
// import { useLazyQuery, gql } from "@apollo/client";
// import { useParams } from "react-router-dom";

// const GET_ALL_TABLE_LIST = gql`
//   query TableList(
//     $floor_id: Int!
//     $start: Int!
//     $limit: Int
//     $search: String
//     $sorting: String
//     $filter: String
//   ) {
//     tableList(
//       floor_id: $floor_id
//       start: $start
//       limit: $limit
//       search: $search
//       sorting: $sorting
//       filter: $filter
//     ) {
//       status
//       message
//       data {
//         id
//         table_name
//         floor_id
//         table_capacity
//         floor_name
//       }
//     }
//   }
// `;

// const TableList = () => {
//   const [tableData, setTableData] = useState([]);
//   const { floorId } = useParams(); 

//   console.log('id--->', floorId)
//    const [getTableList, { loading, error, data }] = useLazyQuery(GET_ALL_TABLE_LIST);

//   useEffect(() => {
//     getTableList({
//       variables: {
//         floor_id: floorId,
//         start: 0,
//         limit: 10, // Set your desired limit
//         search: '', // Optional: Add search criteria if needed
//         sorting: '', // Optional: Add sorting criteria if needed
//         filter: '' // Optional: Add filtering criteria if needed
//       }
//     });
//   }, [getTableList, floorId]);

//   useEffect(() => {
//     if (data && data.tableList && data.tableList.data) {
//       setTableData(data.tableList.data);
//     }
//   }, [data]);

//   return (
//     <div className="floor-list-container">
//       <h2>Table Data</h2>
//       <div style={{ display: "flex", justifyContent: "end" }}>
//         <div className="button-container">
//           <button onClick={() => window.location.href = '/AddTableForm'}>Add Table</button>
//         </div>
//       </div>
//       <table className="floor-table">
//         <thead>
//           <tr>
//             <th>   ID</th>
//             <th>Floor Name</th>
//             <th>Location ID</th>
//             <th>Active</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {floorData.map(floor => (
//             <tr key={floor.id}>
//               <td>{floor.id}</td>
//               <td>
//                 <Link to={`/TableList/${floor.id}`}>
//                   {floor.floor_name}
//                 </Link>
//               </td>
//               <td>{floor.location_id}</td>
//               <td>{floor.is_active ? 'Active' : 'Inactive'}</td>
//               <td>
//                 <EditIcon onClick={() => handleEdit(floor.id)} style={{ cursor: 'pointer' }} />
//                 <DeleteIcon onClick={() => handleDelete(Number(floor.id))} style={{ cursor: 'pointer' }} />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <Dialog open={showDeleteDialog} onClose={cancelDelete}>
//         <DialogTitle>Delete  Floor</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete this floor?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={cancelDelete}>Cancel</Button>
//           <Button onClick={confirmDelete}>Confirm</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default TableList;


import { useLazyQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { useEffect, useState } from "react";
import './ShowFloorList.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useParams } from 'react-router-dom';

export const GET_ALL_TABLE_LIST = gql`
  query TableList(
    $floor_id: Int!
    $start: Int!
    $limit: Int
    $search: String
    $sorting: String
    $filter: String
  ) {
    tableList(
      floor_id: $floor_id
      start: $start
      limit: $limit
      search: $search
      sorting: $sorting
      filter: $filter
    ) {
      status
      message
      data {
        id
        table_name
        floor_id
        table_capacity
        floor_name
      }
    }
  }
`;

export const DELETE_FLOOR = gql`
  mutation DeleteFloor($id: Int!) {
    deleteFloor(id: $id) {
      status
      message
    }
  }
`;

function TableList() {
  const { id } = useParams(); // Destructure URL parameters
  const [floorData, setFloorData] = useState([]); 
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteFloor] = useMutation(DELETE_FLOOR);
  const [floorIdToDelete, setFloorIdToDelete] = useState(null);
  const floorId = 44;

  const [TableList, { loading, error, data }] = useLazyQuery(GET_ALL_TABLE_LIST, {
    variables: { 
      floor_id: Number(id),
      filter: "",
      limit: 20,
      sorting : "",
      start: 1
    },
  });

  console.log('id--->', id);

  useEffect((data) => {
    console.log('dattattataatatat-->', data)
    TableList();
  }, [TableList]);

  useEffect(() => {
    console.log('data--->', data)
    if (data && data?.tableList && data?.tableList?.data) {
      setFloorData(data?.tableList?.data);
    }
  }, [data]);

  const handleEdit = (id) => {
    window.location.href = `/AddTableForm/${id}`;
  };

  const handleDelete = (id) => {
    setShowDeleteDialog(true);
    setFloorIdToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteFloor({ variables: { id: floorIdToDelete } });
      const updatedFloorData = floorData.filter(floor => floor.id !== floorIdToDelete);
      setFloorData(updatedFloorData);
    } catch (error) {
      console.error("Delete mutation error:", error);
    }
    setShowDeleteDialog(false);
    setFloorIdToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setFloorIdToDelete(null);
  };

  console.log('floorData-->',floorData )
  return (
    <div className="floor-list-container">
      <h2>Table Data</h2>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <div className="button-container">
          {/* <button onClick={() => window.location.href = '/AddFloorForm'}>Add Floor</button> */}
          <button onClick={() => window.location.href = '/AddTableForm'}>Add Table</button>
        </div>
      </div>
      <table className="floor-table">
        <thead>
          <tr>
            <th>Table Name</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {floorData.map(floor => (
            <tr key={floor.id}>
              <td>
                  {floor.table_name}
              </td>
              <td>{floor.table_capacity}</td>
              <td>
                <EditIcon onClick={() => handleEdit(floor.id)} style={{ cursor: 'pointer' }} />
                <DeleteIcon onClick={() => handleDelete(Number(floor.id))} style={{ cursor: 'pointer' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={showDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>Delete  Table</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Table?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TableList;
