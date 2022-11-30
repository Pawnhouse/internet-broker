import { useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { createStock } from "../../http/stockAPI";

function AddStock({ show, onHide }) {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  function add() {
    createStock(code, description, true).then(() => {
      onHide();
    }).catch(() => { });
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add Stock
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control placeholder="Input Code" onChange={(e) => setCode(e.target.value)} className="mb-3" />
          <Form.Control as="textarea" onChange={(e) => setDescription(e.target.value)}  placeholder="Description" />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide} variant='secondary'>Close</Button>
        <Button onClick={add}>Add</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddStock