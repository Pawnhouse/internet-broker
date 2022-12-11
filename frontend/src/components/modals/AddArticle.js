import { useState, useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap"
import { createArticle } from "../../http/descriptionAPI";
import { Context } from '../../index';


function AddArticle({ show, onHide, sectionId }) {
  const { articleInfo } = useContext(Context);
  const [headline, setHeadlne] = useState('');
  const [text, setText] = useState('');

  function add() {
    createArticle(headline, text, sectionId).then((article) => {
      articleInfo.allArticles = [article, ...articleInfo.allArticles];
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
          Add article
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            placeholder="Headline"
            className="mb-3"
            onChange={(e) => setHeadlne(e.target.value)}
          />
          <Form.Control
            as="textarea"
            placeholder="Text"
            onChange={(e) => setText(e.target.value)}
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

export default AddArticle