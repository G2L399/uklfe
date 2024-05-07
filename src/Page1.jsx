import React, { useState, useEffect } from "react";
import { Form, Button, Table, Modal, CloseButton } from "react-bootstrap";

import axios from "axios";

const FlagsList = () => {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editFlagId, setEditFlagId] = useState(null); // State to store the ID of the flag being edited
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    image: null,
    name: "",
    size: "",
    price: "",
    action: "",
  });
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const renderImage = (buffer) => {
    const base64String = btoa(
      new Uint8Array(buffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    return `data:image/jpeg;base64,${base64String}`;
  };
  const handleEdit = (flagId) => {
    setOpen(true);
    setEditFlagId(flagId);
    // Populate form fields with existing flag data
    const flagToEdit = flags.find((flag) => flag.id === flagId);
    setFormData({
      image: null,
      name: flagToEdit.name,
      size: flagToEdit.size,
      price: flagToEdit.price,
      action: "edit",
    });
  };
  const handleAdd = () => {
    setOpen(true);
    setFormData({
      image: null,
      name: "",
      size: "",
      price: "",
      action: "add",
    });
  };
  const handleDelete = async (flagId) => {
    try {
      console.log(flagId);
      await axios
        .delete(`http://localhost:8000/coffee/${flagId}`, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then(function (response) {
          fetchFlags();
        });
      fetchFlags();
    } catch (error) {
      console.error("Error deleting flag:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.action === "edit") {
        console.log(editFlagId);
        const Product = new FormData();
        for (const key in formData) {
          Product.append(key, formData[key]);
          console.log(formData[key]);
        }
        const response = await axios.put(
          `http://localhost:8000/coffee/${editFlagId}`,
          Product,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        if (response.data.auth === "false" || response.data.auth === false) {
          setError(response.data.message);
        }

        //   const updatedFlagIndex = flags.findIndex(
        //     (flag) => flag.id === editFlagId
        //   );
        //   const updatedFlags = [...flags];
        //   updatedFlags[updatedFlagIndex] = response.data.data;
        //   setFlags(updatedFlags);
        setEditFlagId(null);
        setOpen(false);
        fetchFlags();
      } else if (formData.action === "add") {
        const Product = new FormData();
        for (const key in formData) {
          Product.append(key, formData[key]);
          console.log(formData[key]);
        }
        const response = await axios.post(
          "http://localhost:8000/coffee",
          Product,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        if (response.data.auth === "false" || response.data.auth === false) {
          setError(response.data.message);
        }
        setOpen(false);
        fetchFlags();
      }
    } catch (error) {
      console.error("Error updating flag:", error);
    }
  };
  const fetchFlags = async () => {
    try {
      const response = await axios.get("http://localhost:8000/coffee");
      setFlags(response.data.data);
      setLoading(false);
      console.log(flags);
    } catch (error) {
      console.error("Error fetching flags:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  return (
    <div>
      <h2>Flags List</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="container">
          <Table size="sm" bordered hover style={{borderColor: 'black',borderWidth:"5px"}}>
            <thead className="   ">
              <tr className="    ">
                <th className="  ">Menu Name</th>
                <th className="  ">Image</th>
                <th className="  ">Size</th>
                <th className="  ">Price</th>
                <th className="  ">Options</th>
                {/* Add more headers as needed */}
              </tr>
            </thead>
            <tbody className=" ">
              {flags
                .filter((flag) =>
                  flag.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((flag) => (
                  <tr key={flag.id} className=" ">
                    <td className="  w-25 h5">{flag.name}</td>
                    <td className="  w-25">
                      <img
                        className="my-4"
                        style={{
                          maxWidth: "15rem",
                          maxHeight: "10rem",
                          width: "auto",
                          height: "auto",
                          outline: "5px solid black",
                        }}
                        src={renderImage(flag.image.data)}
                        alt={flag.ImageName}
                      />
                    </td>
                    <td className="  h5">{flag.size}</td>
                    <td className="  h5">{flag.price}</td>
                    <td className="  h5">
                      <div className="d-flex justify-content-evenly">
                        {/* Button to edit a flag */}
                        <Button
                          variant="primary"
                          onClick={() => handleEdit(flag.id)}
                        >
                          Edit
                        </Button>
                        {/* Button to delete a flag */}
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(flag.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                    {/* Add more cells as needed */}
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      )}
      <div>
        <Button variant="success" className="mx-5" onClick={handleAdd}>Add Data</Button>
      </div>
      {/* Modal for editing a flag */}
      <Modal show={open} onHide={() => setEditFlagId(null)}>
        <Modal.Header>
          <Modal.Title>Menu</Modal.Title>
          <CloseButton onClick={() => setOpen(false)} />
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formImage">
              <Form.Label>Menu Name</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Menu Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formSize">
              <Form.Label>Size</Form.Label>
              <Form.Control
                type="text"
                name="size"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                name="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FlagsList;
