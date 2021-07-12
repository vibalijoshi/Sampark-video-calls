import React, { useState, useEffect, useCallback, useContext } from 'react';
import { message } from 'antd';
import { SocketContext } from '../../SocketContext';
import './Notes.css';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';
import { jsPDF } from 'jspdf';
import NoteAddIcon from '@material-ui/icons/NoteAdd';

import { makeStyles, Dialog } from '@material-ui/core';
const Notes = () => {
  const { notes, setNotes, showNotesBox, setShowNotesBox} = useContext(SocketContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileView, setMobileView] = useState(false);

  const resize = () => {
    setMobileView(window.innerWidth <= 600);
  };
  const useStyles = makeStyles({
    dialog: {
      position: 'absolute',
      right: 10,
      
    }
  });
  const classes = useStyles();
  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
  }, []);

  const handleClick = (event) => {
    resize();
    setAnchorEl(event.currentTarget);
    setShowNotesBox(!showNotesBox);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowNotesBox(!showNotesBox);
  };
  const downLoadAsPdf = () => {
    if (notes.trim().length == 0) {
      message.error('Please write some text to download');
      return;
    }
    const pdfDoc = new jsPDF();
    pdfDoc.text(notes, 10, 10);
    message.success('Your notes is downloading');
    pdfDoc.save('Sampark Meeting Notes.pdf');
  };

  return (
    <>
      { (
        <button className='tooltip' type='primary' onClick={handleClick}>
          <NoteAddIcon />
          <span className='tooltiptext'>Notes</span>
        </button>
      )}
      <Dialog
      classes={{
        paper: classes.dialog
      }}
      disableBackdropClick = 'true'
      onClose={handleClose}
          transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
    PaperProps={{
    style: {
      width: '400px',
      minHeight: '6.5in',
      padding: '20px',
      margin: '1rem',
    },
    
  }}
  BackdropProps={{style: {backgroundColor: 'transparent'}}}
      open={showNotesBox}
      onClose={handleClose}
      aria-labelledby='draggable-dialog-title'
      >
        <div className='notes'>
          <div className='btn-div'>
            <div>
              <h3>Notes</h3>
            </div>
            <div className='flex-btns-div'>
              <button type='primary' onClick={downLoadAsPdf}>
                <GetAppIcon />
              </button>
              <button type='primary' onClick={handleClose}>
                <CloseIcon />
              </button>
            </div>
          </div>

          <textarea
            type='text'
            placeholder='Note Down the important points here!'
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
            }}
          />
        </div>
      </Dialog>
    </>
  );
};

export default Notes;
