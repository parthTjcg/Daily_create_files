import React, { useEffect, useState } from 'react';
import { useMutation, gql, useQuery } from '@apollo/client';
import './AddFloorComponent.css';
import { useParams } from 'react-router-dom';

const ADD_FLOOR = gql`
  mutation AddFloor($floor_name: String!, $location_id: Int!, $is_active: Boolean) {
    addFloor(floor_name: $floor_name, location_id: $location_id, is_active: $is_active) {
      status
      message
      error {
        floor_name
      }
    }
  }
`;

const EDIT_FLOOR = gql`
  mutation EditFloor($id: Int!, $floor_name: String!, $location_id: Int!, $is_active: Boolean) {
    editFloor(id: $id, floor_name: $floor_name, location_id: $location_id, is_active: $is_active) {
      status
      message
      error {
        floor_name
      }
    }
  }
`;

export const GET_FLOOR_BY_ID = gql`
  query FloorFindById($id: Int!) {
    floorFindById(id: $id) {
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

const AddFloorComponent = () => {
  const { id } = useParams(); // Destructure URL parameters

  console.log('id--->', id);

  const [floorName, setFloorName] = useState('');
  const [locationId, setLocationId] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [floorId, setFloorId] = useState(null);

  const [addFloor, { loading: addLoading, error: addError }] = useMutation(ADD_FLOOR);
  const [editFloor, { loading: editLoading, error: editError }] = useMutation(EDIT_FLOOR);
  const { loading: floorLoading, error: floorError, data: floorData } = useQuery(GET_FLOOR_BY_ID, {
    variables: { id: parseInt(id) },
    skip: !id, // Skip the query if 'id' is not available
  });

  
  const handleFloorAction = async () => {
    if (floorId) {
      // Editing floor
      try {
        const { data } = await editFloor({
          variables: {
            id: parseInt(floorId), // Use floorId here
            floor_name: floorName,
            location_id: locationId,
            is_active: isActive,
          },
        });
        console.log(data);
        window.location.href = '/'; // Redirect to home page after successful edit
      } catch (error) {
        console.error('Edit mutation error:', error);
      }
    } else {
      // Adding floor
      try {
        const { data } = await addFloor({
          variables: {
            floor_name: floorName,
            location_id: locationId,
            is_active: isActive,
          },
        });
        console.log(data);
        window.location.href = '/'; // Redirect to home page after successful addition
      } catch (error) {
        console.error('Add mutation error:', error);
      }
    }
  };

  useEffect(() => {
    if (id) {
      setFloorId(id);
      // Fetch floor details based on 'id' and set other state values (floorName, locationId, isActive)
      // ...

      // Example: Set floor_id using the URL 'id' parameter
      setLocationId(parseInt(id)); // Set locationId as an example
    }
  }, [id]);

  useEffect(() => {
    // Set floor details when data is available
    console.log('floorData---->',)
    if (floorData && floorData?.floorFindById && floorData?.floorFindById?.data) {
      const fetchedFloor =  floorData.floorFindById.data;
      setFloorId(fetchedFloor.id);
      setFloorName(fetchedFloor.floor_name);
      setLocationId(fetchedFloor.location_id);
      setIsActive(fetchedFloor.is_active);
    }
  }, [floorData]);

  return (
    <div className="add-floor-container">
      <h1>{floorId ? 'Edit Floor' : 'Add Floor'}</h1>
      <div>
        <input
          type="text"
          placeholder="Floor Name"
          value={floorName}
          onChange={(e) => setFloorName(e.target.value)}
          className="floor-input"
        />
        <label className="active-label">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="active-checkbox"
          />
          Active
        </label>
        <button onClick={handleFloorAction}>{floorId ? 'Edit Floor' : 'Add Floor'}</button>
      </div>
    </div>
  );
};

export default AddFloorComponent;
