import React from 'react';
import ReactDOM from 'react-dom';
import './ConfirmationModal.css';

const Backdrop = (props) => {
  return <div className="backdrop-style" onClick={props.onConfirm} />;
};

const ModalOverlay = (props) => {
    const onYes = () => {
        props.onConfirm(props.postId);
    }
    
    const onNo = () => {
        props.onConfirm(null);
    }
  return (
    <div className="modal-content">
      <header className="header">
        <h2>{props.title}</h2>
      </header>
      <div className="content">
        <p>{props.message}</p>
      </div>
      <footer className="actions">
        <button onClick={onYes} className="btn waves-effect #0d47a1 blue darken-4">Yes</button>
        <button onClick={onNo} style={{marginLeft: '1rem'}} className="btn waves-effect #b71c1c red darken-4">No</button>
      </footer>
    </div>
  );
};

const ConfiramtionModal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop onConfirm={props.onConfirm} />,
        document.getElementById('backdrop-root')
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          title={props.title}
          message={props.message}
          postId={props.postId}
          onConfirm={props.onConfirm}
        />,
        document.getElementById('overlay-root')
      )}
    </React.Fragment>
  );
};

export default ConfiramtionModal;