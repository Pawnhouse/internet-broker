import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap"
import { createShares } from "../../http/stockAPI";

function AddShare({ show, onHide }) {
  const [sharesName, setSharesName] = useState('');
  const [stockList, setStockList] = useState('');
  const [description, setDescription] = useState('');

  function add() {
    createShares(sharesName, stockList.split(' '), description, true).then(() => {
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
          Add Share
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            placeholder="Input name"
            className="mb-3"
            onChange={(e) => setSharesName(e.target.value)}
          />
          <Form.Control
            as="textarea"
            placeholder="Stock"
            className="mb-3"
            onChange={(e) => setStockList(e.target.value)}
          />
          <Form.Control
            as="textarea"
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide} variant='secondary'>Close</Button>
        <Button onClick={add}>Add</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddShare