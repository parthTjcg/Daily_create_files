import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import './AddTableForm.css';

export const ADD_TABLE = gql`
  mutation AddTable(
    $table_name: String!
    $floor_id: [Int]! 
    $location_id: Int!
    $table_capacity: Int
  ) { 
    addTable(
      table_name: $table_name
      floor_id: $floor_id
      location_id: $location_id
      table_capacity: $table_capacity
    ) {
      status
      message
      error {
        table_name
      }
    }
  }
`;

export const EDIT_TABLE = gql`
  mutation EditTable(
    $id: Int!
    $table_name: String!
    $floor_id: Int!
    $table_capacity: Int
  ) {
    editTable(
      id: $id
      table_name: $table_name
      floor_id: $floor_id
      table_capacity: $table_capacity
    ) {
      status
      message
      error {
        table_name
      }
    }
  }
`;

export const GET_FLOOR_DROPDOWN = gql`
  query FloorDropdown(
    $start: Int!
    $location_id: Int!
    $limit: Int
    $search: String
  ) {
    floorDropdown(
      start: $start
      location_id: $location_id
      limit: $limit
      search: $search
    ) {
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

export const GET_TABLE_BY_ID = gql`
  query TableFindById($id: Int!) {
    tableFindById(id: $id) {
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

function AddTableForm() {
  const [tableName, setTableName] = useState("");
  const [tableCapacity, setTableCapacity] = useState(0);
  const [selectedFloor, setSelectedFloor] = useState(0);

  const { id } = useParams();

  console.log('id', id)
  const floorid = [Number(selectedFloor)]

  const [addTable] = useMutation(ADD_TABLE);
  const [editTable, { loading: editLoading, error: editError }] = useMutation(EDIT_TABLE);
  const { loading: floorLoading, error: floorError, data: tableData } = useQuery(GET_TABLE_BY_ID, {
    variables: { id: parseInt(id) },
    skip: !id, // Skip the query if 'id' is not available
  });
  const { loading, error, data } = useQuery(GET_FLOOR_DROPDOWN, {
    variables: {
      start: 0,
      floor_id: Number(selectedFloor),
      location_id: 1,
      limit: 10,
      search: "", // You can specify a search string here if required
    },
  });

  // const handleAddTable = (event) => {
  //   event.preventDefault(); 

  //   addTable({
  //     variables: {
  //       table_name: tableName,
  //       floor_id: floorid,
  //       location_id: 1, 
  //       table_capacity: Number(tableCapacity),
  //     },
  //   })
  //     .then((response) => {
  //       setTableName("");
  //       setTableCapacity(0);
  //       window.location.href = `/TableList/${selectedFloor}`;
  //     })
  //     .catch((error) => {
  //       if (error.message === 'Session expired!') {
  //         window.location.href = '/login';
  //       } else {
  //         console.error("Error adding table:", error);
  //       }
  //     });
  // };

  const handleAddTable = async () => {
    if (id) {
      // Editing floor
      try {
        const { data } = await editTable({
          variables: {
            id: id,
            table_name: tableName,
            floor_id: floorid,
            location_id: 1,
            table_capacity: Number(tableCapacity),
          },
        });
        console.log(data);
        // window.location.href = `/TableList/${selectedFloor}`
      } catch (error) {
        console.error('Edit mutation error:', error);
      }
    } else {
      // Adding floor
      try {
        const { data } = await addTable({
          variables: {
            table_name: tableName,
            floor_id: floorid,
            location_id: 1,
            table_capacity: Number(tableCapacity),
          },
        });
        console.log(data);
        // window.location.href = `/TableList/${selectedFloor}`
      } catch (error) {
        console.error('Add mutation error:', error);
      }
    }
  };


  useEffect(() => {
    // Set floor details when data is available
    console.log('data---->', tableData)
    if (tableData && tableData?.tableFindById && tableData?.tableFindById?.data) {
      const fetchedTable =  tableData.tableFindById.data;
      // setFloorId(fetchedFloor.id);
      // setFloorName(fetchedFloor.floor_name);
      // setLocationId(fetchedFloor.location_id);
      // setIsActive(fetchedFloor.is_active);
      setTableName(fetchedTable.floor_name)
      setSelectedFloor()
    }
  }, [tableData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="table-form">
        <h2>{id ? 'Edit Table' : 'Add Table'}</h2>
        <form onSubmit={handleAddTable}>
          <label>
            Table Name:
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
            />
          </label>
          <label>
            Select Floor:
            <select
              className="floor-dropdown" // Add a class name for styling
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
            >
              <option value="">Select a floor</option>
              {data.floorDropdown.data.map(floor => (
                <option key={floor.id} value={floor.id}>
                  {floor.floor_name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Table Capacity:
            <input
              type="number"
              value={tableCapacity}
              onChange={(e) => setTableCapacity(e.target.value)}
            />
          </label>
          <div className="button-group">
            <button type="submit" className="add-btn">Add</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddTableForm;
