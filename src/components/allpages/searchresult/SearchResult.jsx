

import  { useState } from "react";
// import "./SaveList.css";
import "../savedlist/SaveList.css"
import {
  documents,
  sops,
  trainingSimulations,
  testSimulations,
} from "../savedlist/SaveListData";
import documentsIcon from "../../../assets/svg/SavedList/DocumentsIcon.svg";
import sopsIcon from "../../../assets/svg/SavedList/SPOsIcon.svg";
import trainingIcon from "../../../assets/svg/SavedList/TrainingSimulationIcon.svg";
import testIcon from "../../../assets/svg/SavedList/TestSimulation.svg";
import openBook from "../../../assets/svg/SavedList/OpenBook.svg";
import SOPsIcon from "../../../assets/svg/SavedList/SOPsHeading.svg";
import TrainingIcon from "../../../assets/svg/SavedList/TrainingHeading.svg";
import TestIcon from "../../../assets/svg/SavedList/TestHeading.svg";
import BackButton from '../../../assets/svg/SavedList/BackButton.svg';
import SearchIcon from '../../../assets/svg/SearchResult/SearchIcon.svg'

const SearchResult = () => {
  const [showAllDocuments, setShowAllDocuments] = useState(false);
  const [showAllSops, setShowAllSops] = useState(false);
  const [showAllTrainingSimulations, setShowAllTrainingSimulations] =
    useState(false);
  const [showAllTestSimulations, setShowAllTestSimulations] = useState(false);
  // const [showAllTestSimulations, setShowAllTestSimulations] = useState(false);
  // const [showAllTestSimulations, setShowAllTestSimulations] = useState(false);

  const HandleViewAllDocuments = () => setShowAllDocuments(true);
  const HandleViewAllSops = () => setShowAllSops(true);
  const HandleViewAllTrainingSimulations = () =>
    setShowAllTrainingSimulations(true);
  const HandleViewAllTestSimulations = () => setShowAllTestSimulations(true);



  const displayedDocuments = showAllDocuments ? documents : documents.slice(0, 12);
  const displayedSops = showAllSops ? sops : sops.slice(0, 12);
  const displayedTrainingSimulations = showAllTrainingSimulations
    ? trainingSimulations
    : trainingSimulations.slice(0, 12);
  const displayedTestSimulations = showAllTestSimulations
    ? testSimulations
    : testSimulations.slice(0, 12);

  const shouldShowViewAllDocuments = documents.length > 12;

  const shouldShowViewAllSops = sops.length > 12;

  const shouldShowViewAllTrainingSimulations = trainingSimulations.length > 12;

  const shouldShowViewAllTestSimulations = testSimulations.length > 12;
  return (
    <div >
      <div
      //  className="cards"
      // style={{backgroundColor:"red"}}
       >
       <div 
    style={{
      position: "fixed", 
      width: "100%",  // Ensures it stretches the full width of the screen
      zIndex: "1000",  // Ensures it's on top of other elements
      display: "flex", 
      backgroundColor: "#DBEAFE", 
      padding: "0.5rem 1.5rem", 
      alignItems: "center", 
      justifyContent: "start",
      gap: "10px"  // Optional: adds some space between the image and paragraph
    }}
>
  <div style={{marginBottom:"0.4rem"}}>
  <img src={SearchIcon} alt="BookMark Icon" className='icons'  />
  </div>
  <p style={{ margin: 0 }}> <b>Search Result for “Account Opening”</b></p>
</div>

      </div>
      <div className="save-list" >
      <div className="card" style={{marginTop:"7rem"}}>
        <div className="card-header">
          {showAllDocuments && (
            <img src={BackButton} alt="Back Button" className="icons back-button" onClick={() => setShowAllDocuments(false)} />
          )}
          <img src={openBook} alt="Documents Icon" className="icons" />
          <p className='fav-sub-heading'>Documents <span className='count'> ({documents.length})</span></p>
          {!showAllDocuments && shouldShowViewAllDocuments && (
            <span className="view-all" onClick={HandleViewAllDocuments}>View All {">"}</span>
          )}
        </div>
        <div className="divider"></div>
        <div className="card-content">
          {displayedDocuments.map((doc, index) => (
            <div key={index} className="document-card" style={{backgroundColor:"#fff",border:"2px solid #E2E8F0",borderRadius:"8px"}}>
              <img src={documentsIcon} alt="Documents Icon" className="icons" />
              <p>{doc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          {showAllSops && (
            <img src={BackButton} alt="Back Button" className="icons back-button" onClick={() => setShowAllSops(false)} />
          )}
          <img src={SOPsIcon} alt="SOPs Icon" className="icons" />
          <p className='fav-sub-heading'>SOPs <span className='count'> ({sops.length})</span></p>
          {!showAllSops && shouldShowViewAllSops &&(
            <span className="view-all" onClick={HandleViewAllSops}>View All {">"}</span>
          )}
        </div>
        <div className="divider"></div>
        <div className="card-content">
          {displayedSops.map((sop, index) => (
            <div key={index} className="document-card" style={{backgroundColor:"#fff",border:"2px solid #E2E8F0",borderRadius:"8px"}}>
              <img src={sopsIcon} alt="SOPs Icon" className="icons" />
              <p>{sop}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          {showAllTrainingSimulations && (
            <img src={BackButton} alt="Back Button" className="icons back-button" onClick={() => setShowAllTrainingSimulations(false)} />
          )}
          <img src={TrainingIcon} alt="Training Icon" className="icons" />
          <p className='fav-sub-heading'>Training Simulations <span className='count'> ({trainingSimulations.length})</span></p>
          {!showAllTrainingSimulations &&  shouldShowViewAllTrainingSimulations && (
            <span className="view-all" onClick={HandleViewAllTrainingSimulations}>View All {">"}</span>
          )}
        </div>
        <div className="divider"></div>
        <div className="card-content">
          {displayedTrainingSimulations.map((training, index) => (
            <div key={index} className="document-card" style={{backgroundColor:"#fff",border:"2px solid #E2E8F0",borderRadius:"8px"}}>
              <img src={trainingIcon} alt="Training Icon" className="icons" />
              <p>{training}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          {showAllTestSimulations && (
            <img src={BackButton} alt="Back Button" className="icons back-button" onClick={() => setShowAllTestSimulations(false)} />
          )}
          <img src={TestIcon} alt="Test Icon" className="icons" />
          <p className='fav-sub-heading'>Test Simulations  <span className='count'>({testSimulations.length})</span> </p>
          {!showAllTestSimulations && shouldShowViewAllTestSimulations && (
            <span className="view-all" onClick={HandleViewAllTestSimulations}>View All {">"}</span>
          )}
        </div>
        <div className="divider"></div>
        <div className="card-content">
          {displayedTestSimulations.map((test, index) => (
            <div key={index} className="document-card" style={{backgroundColor:"#fff",border:"2px solid #E2E8F0",borderRadius:"8px"}}>
              <img src={testIcon} alt="Test Icon" className="icons" />
              <p>{test}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default SearchResult;
