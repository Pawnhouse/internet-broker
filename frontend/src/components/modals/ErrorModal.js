import { Button, Modal } from "react-bootstrap"

function ErrorModal({ show, onHide, message}) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="s"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Error
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>OK</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ErrorModal