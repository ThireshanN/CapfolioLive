import React, { useEffect, useState } from 'react';
import { Collapse, CButton, CCollapse, CListGroup, CListGroupItem, CCard, CCardBody, CRow, CCol, CCardImage, CCardTitle, CCardText, CCardFooter } from '@coreui/react';
import Placeholder from '../images/download.png'
const MainImage = (props) => {

    const [array, setArray] = useState([])
    const [Image, setImage] = useState()
    const [placeholder, setplaceholder] = useState()



    useEffect(() => {
        fetch(`/project/listTeamFiles/${props.teamname}`)
            .then(response => response.json())
            .then(files => {
                setArray(files)
            })

    }, []);



    useEffect(() => {
        const responseArray = []
        const getImage = async () => {
            console.log(array[0])
            if (array.length === 0){
                setImage(Placeholder)
            }
            else {
                const response = await fetch(`/project/retrieveFile/${array[0]}`)
                const data = await response.text()
                responseArray.push(data)
                setImage(responseArray)
            }
        };

        

        getImage()
    }, [array]);







    return (

        <CCardImage id='imgcard' orientation="top" src={Image} />

    );
};

export default MainImage;