import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { ipcRenderer } from 'electron';
import { faUpload, faCheck, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HandHistory, UploadHandHistoryResponse, UploadHandHistoryStatus } from '../../shared/models';
import { HandContext } from '../contexts/handContext';

interface SelectFileProps {
  hasFiles: boolean
}

interface UploadIconProps {
  isDrag?: boolean,
}

const Container = styled.div`
  display: flex;
  width: 80%;
  margin: auto;
  justify-content: center;
  min-height: 600px;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 4px;
  background: white;
  border-radius: 15px;
`

const Form = styled.form`
  height: 500px;
  width: 500px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 2px 4px;
  border-radius: 25px;
  display: flex;
  align-items: center;
`

const FormContent = styled.div`
  width: 100%;
  height: 80%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
`

const FormText = styled.div`
  font-size: 24px;
  margin: 25px;
`

const FormButton = styled.button`
  border: none;
  font-size: 16px;
  margin: 25px;
  background: white;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s ease;
  :hover {
    opacity: 1;
    text-decoration: underline;
  }
`

const SelectFile = styled.input<SelectFileProps>`              
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
  ::file-selector-button {
    display: none;
  }
`

const SelectFileLabel = styled.label`
  border: none;
  font-size: 16px;
  margin: 5px;
  background: white;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s ease;
  :hover {
    opacity: 1;
    text-decoration: underline;
  }
`

const DragFileElement = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const UploadIcon = styled(FontAwesomeIcon)<UploadIconProps>`
  top: 50%;
  width: 200px;
  height: 200px;
  opacity: ${props => props.isDrag ? '1': '0.2'};
  x-index: -1;
  transition: opacity .3s ease;
  :hover {
    opacity: 1;
  }
`

const Hands: React.FC = () => {

  const [filePaths, setFilePaths] = useState<Array<string>>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [results, setResults] = useState<Array<UploadHandHistoryResponse>>([]);
  const ref = useRef<HTMLInputElement>(null);
  const { setCurrentHands, setMinDate, setMaxDate, setMinNetGain, setMaxNetGain} = useContext(HandContext)

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.setAttribute("directory", "");
      ref.current.setAttribute("webkitdirectory", "");
      ref.current.setAttribute("multiple", "true");
    }
  }, [ref, filePaths])

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const res = await ipcRenderer.invoke('upload', filePaths);
      for(let i=0; i<res.length; i++) {
        if(res[i].status === UploadHandHistoryStatus.Error) {
          toast(`${res[i].message} in ...${res[i].fileName.substring(res[i].fileName.length - 10, res[i].fileName.length )}`)
        }
      }
      const data: Array<HandHistory> = await ipcRenderer.invoke('getHandHistories', {})
      setCurrentHands(data);
      setMinDate(Math.min(...Object.values(data.map((hand) => new Date(hand.date).getTime()))) - 100);
      setMaxDate(Math.max(...Object.values(data.map((hand) => new Date(hand.date).getTime()))) + 100);
      setMinNetGain(Math.min(...Object.values(data.map((hand) => hand.net_gain))) - 100);
      setMaxNetGain(Math.max(...Object.values(data.map((hand) => hand.net_gain))) + 100);
      setResults(res);
    }catch(err) {
      toast(`${err}`)
    }
  }

  const handleFileChange = (e: any) => {
    setFilePaths(Array.from(e.target.files).map((file: any) => file.path));
  }

  const handleClearClick = (e: any) => {
    if(ref.current != null) {
      ref.current.value = ''
    }
    setFilePaths([]);
  }

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFilePaths(Array.from(e.dataTransfer.files).map((file: any) => file.path));
    }
  };

  const handleConfirmSuccess = () => {
    setFilePaths([]);
    setResults([]);
  }

  return (
      <Container>
        <Form onSubmit={handleSubmit} onDragEnter={handleDrag}>
          {
            results.length > 0 ? <FormContent>
              <UploadIcon icon={faThumbsUp} style={{color: "green"}} onClick={() => handleConfirmSuccess()}/>
              <FormText>Files uploaded!</FormText>
            </FormContent>:
            filePaths.length === 0 ? <FormContent>
              <FormText>Drag and drop or ...</FormText>
              <SelectFileLabel htmlFor="file">
                <UploadIcon isDrag={dragActive} icon={faUpload} style={{color: "green"}} />
              </SelectFileLabel>
              <SelectFile hasFiles={filePaths.length > 0} ref={ref} type="file" id="file" onChange={handleFileChange}></SelectFile>
              { dragActive && <DragFileElement id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></DragFileElement> }
            </FormContent>:
            <FormContent>
              <FormText>Ready to upload!</FormText>
              <FormButton onClick={(e) => handleSubmit(e)}>
                <UploadIcon icon={faCheck} style={{color: "green"}} />
              </FormButton>
              <FormButton onClick={(e) => handleClearClick(e)}>Choose a different file...</FormButton>
            </FormContent>
          }
        </Form>

      </Container>
  );
};

export default Hands;