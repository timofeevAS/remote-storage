import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";

export default function UploadForm({ handleUploadSuccess, dep,folder }) {
  const { register, handleSubmit } = useForm();
  const [responseMessage, setResponseMessage] = useState("");

  


  const onSubmit = async (data) => {
    const formData = new FormData();
    const nullOrEmptyStr = (obj) => {obj !== null && obj !== '' ? true : false};

    formData.append("file", data.file[0]);
    formData.append("name", data.name);
    console.log(folder);
    formData.append("folder",folder !== null ? folder : '');
    formData.append("department", (dep !== 'All' && nullOrEmptyStr(dep)) ? dep : '');
    

    const res = await fetch("http://localhost:8000/users/files/", {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.status === 201) {
        handleUploadSuccess(); // Вызываем функцию при успешном создании
      }
      return res.json();
    });
  
    setResponseMessage(`${res.message}, status: ${res.status}`);
  };
  

  useEffect(() => {
    if (responseMessage) {
      alert(responseMessage);
      setResponseMessage("");
    }
  }, [responseMessage]);

  return (
    <div className="uploadFile">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="nameInput">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" {...register("name")} />
        </Form.Group>
        <Form.Group controlId="fileInput">
          <Form.Label>Choose a file</Form.Label>
          <Form.Control type="file" {...register("file")} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Upload
        </Button>
      </Form>
    </div>
  );
}
