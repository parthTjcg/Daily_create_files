import { useLazyQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { useEffect, useState } from "react";
import './ShowFloorList.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

export const GET_ALL_FLOOR_LIST = gql`
  query FloorList($location_id: Int!) {
    floorList(location_id: $location_id) {
      status
      message
      data {
        id
        floor_name
        location_id
        is_active
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

function ShowFloorList() {
  const [floorData, setFloorData] = useState([]); 
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteFloor] = useMutation(DELETE_FLOOR);
  const [floorIdToDelete, setFloorIdToDelete] = useState(null);

  const [getFloorList, { loading, error, data }] = useLazyQuery(GET_ALL_FLOOR_LIST, {
    variables: { location_id: 1 },
  });

  useEffect(() => {
    getFloorList();
  }, [getFloorList]);

  useEffect(() => {
    if (data && data.floorList && data.floorList.data) {
      setFloorData(data.floorList.data);
    }
  }, [data]);

  const handleEdit = (id) => {
    window.location.href = `/AddFloorForm/${id}`;
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

  return (
    <div className="floor-list-container">
      <h2>Floor Data</h2>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <div className="button-container">
          <button onClick={() => window.location.href = '/AddFloorForm'}>Add Floor</button>
          {/* <button onClick={() => window.location.href = '/AddTableForm'}>Add Table</button> */}
        </div>
      </div>
      <table className="floor-table">
        <thead>
          <tr>
            <th>Floor Name</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {floorData.map(floor => (
            <tr key={floor.id}>
              <td>
                <Link to={`/TableList/${floor.id}`}>
                  {floor.floor_name}
                </Link>
              </td>
              <td>{floor.is_active ? 'Active' : 'Inactive'}</td>
              <td>
                <EditIcon onClick={() => handleEdit(floor.id)} style={{ cursor: 'pointer' }} />
                <DeleteIcon onClick={() => handleDelete(Number(floor.id))} style={{ cursor: 'pointer' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={showDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>Delete  Floor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this floor?
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

export default ShowFloorList;
