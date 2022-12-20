import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap"
import { send } from "../../http/notififcationAPI";


function SendNotification({ userId, show, onHide }) {
  const [text, setText] = useState('');
  function sendNotification() {
    send(text, userId).then(() => onHide()).catch(() => { });
  }

  return (
    <Modal
      show={show}
      onHide={() => {onHide(); setText('')}}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Send Notification
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            as="textarea"
            className="mb-3"
            placeholder="Text"
            value={text}
            rows={3}
            onChange={(e) => setText(e.target.value)}
          />

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={sendNotification}>Send</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SendNotification