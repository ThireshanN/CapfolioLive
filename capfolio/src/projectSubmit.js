import React, { useState, KeyboardEventHandler } from 'react';
import {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBTextArea
} from 'mdb-react-ui-kit';
import CreatableSelect from 'react-select/creatable';
import './projectSubmit.css';

const technologies = [
    { value: "blues", label: "React" },
    { value: "rock", label: "Javascript" },
    { value: "jazz", label: "HTML" },
    { value: "orchestra", label: "C#" },
];



export default function ProjectSubmit() {
    
    const [selectedOption, setSelectedOption] = useState("");
    var handleChange = (selectedOption) => {
        console.log(selectedOption);
        setSelectedOption(selectedOption.value);
    };


    return (
        <div>
        
        <form className='projectsubmitform'>
            <MDBRow className='mb-4'>
                <MDBCol>
                    <MDBInput id='form6Example1' label='Company Name' />
                </MDBCol>
                <MDBCol>
                    <MDBInput id='form6Example2' label='Project Title' />
                </MDBCol>
            </MDBRow>

            <MDBTextArea label='Tell us about your project' id='textAreaExample' className='textAreaExample' rows={4} />
            <MDBTextArea label='Tell us about your project approach' id='textAreaExample' className='textAreaExample' rows={4} />
            
            <CreatableSelect isMulti options={technologies} onChange={handleChange} placeholder='Select from the drop down or type' />
            <CreatableSelect isMulti onChange={handleChange} placeholder='Type names' />

            <MDBInput label='Github Link' id='typeURL' type='url' />
            <MDBInput label='Youtube demo link' id='typeURL' type='url' />

                <label for="formFileMultiple" class="form-label">Upload screenshots of your project</label>
                <input class="form-control" type="file" id="formFileMultiple" multiple />

            <MDBBtn className='mb-4' type='submit' block>
                Submit Project!
            </MDBBtn>
            </form>
        </div>
    );
}