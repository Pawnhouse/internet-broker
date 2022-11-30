import { Button, Form, Modal } from "react-bootstrap"

function AddArticle({ show, onHide, sectionName}) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add article
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control placeholder="Headline" className="mb-3"/>
          <Form.Control placeholder="Stock name" className="mb-3" defaultValue={sectionName}/>
          <Form.Control as="textarea" placeholder="Text"/>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide} variant='secondary'>Close</Button>
        <Button onClick={onHide}>Add</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddArticle