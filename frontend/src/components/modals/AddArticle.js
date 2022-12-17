import { useState, useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap"
import { writeArticle, addPicture } from "../../http/descriptionAPI";
import { Context } from '../../index';


function AddArticle({ show, onHide, sectionId }) {
  const { articleInfo, stockInfo } = useContext(Context);
  const [headline, setHeadlne] = useState('');
  const [text, setText] = useState('');
  const [closed, setClosed] = useState(false);
  const [about, setAbout] = useState(stockInfo.currentStock.code || stockInfo.currentStock.sharesName);
  const [file, setFile] = useState('');
  const [theInputKey, setTheInputKey] = useState('');
  const [currentArticle, setCurrentArticle] = useState();

  function add() {
    let aboutId = sectionId;
    if (about === '') {
      aboutId = '';
    }
    writeArticle(headline, text, aboutId, closed, currentArticle?.sectionId).then(async (article) => {
      if (file) {
        const formData = new FormData();
        formData.append('filetoupload', file);
        formData.append('id', `${article.sectionId}`);
        await addPicture(formData);
      }
      setCurrentArticle(article);
      setFile(null);
      setTheInputKey(Math.random().toString());
      setText('');
    }).catch(() => { });
  }
  function end() {
      articleInfo.allArticles = [currentArticle, ...articleInfo.allArticles];
      setCurrentArticle(null);
      onHide();
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
            placeholder="About"
            className="mb-3"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
          <Form.Check type="checkbox" className="mb-3" label="Closed" onChange={(e) => setClosed(x => !x)}/>
          <Form.Control
            as="textarea"
            className="mb-3"
            placeholder="Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Form.Group className="mb-3">
            <Form.Label>Attachment picture</Form.Label>
            <Form.Control type="file" key={theInputKey} onChange={e => setFile(e.target.files[0])} />
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={end} variant='success'>Save</Button>
        <Button onClick={add}>Write</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddArticle