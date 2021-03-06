import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./profile.css";
import { Button, Form, Input, Checkbox } from "antd";
import organisationImg from "../../assets/Organisation Name.svg";
import emailImg from "../../assets/Email ID.svg";
import phoneImg from "../../assets/Phone - .svg";
import userImg from "../../assets/user.svg";
import {ORGANISATION_NAME,ORGANISATION_ADDRESS, CONTACT_NO, INVALID_CONATCT, NAME_NO_SPECIAL, ONLY_WHITESPACE} from '../../constants/messages';
import { PHONE_VALIDATION, NAME_VALIDATION, WHITESPACE_VALIDATION} from '../../constants/constants';

/**
 * Profile form to render when user vists My profile page
 */
export default function ProfileForm(props) {
  const { values, handleSubmit, handleCancel, role, interestList, disableButton, handleDisableChange } = props;
  let [interestsList,setInterest] = useState(values.interest);
  let [ifUpdate, setUpdate] = useState(disableButton);

  useEffect(() => {
    setUpdate(disableButton)
  }, [disableButton])

  function handleChange(values){
    const {name, organization, address, contact_number} = props.values;
    let ifUpdated = false;
    let id = values.target.id;
    let value = values.target.value;
    if(id === "profile_name" && name!==value ) ifUpdated = true;
    if(id === "profile_address" && address!==value ) ifUpdated = true;
    if(id === "profile_organization" && organization!==value ) ifUpdated = true;
    if(id === "profile_contact_number" && contact_number!==value ) ifUpdated = true;
    handleDisableChange(ifUpdate);
    setUpdate(ifUpdated);

  }
  function onFinish(data) {
    delete data.email;
    if(role === "subscriber")
      data.interest = interestsList;

    handleSubmit(data);
  }

  function handleCheckboxChange (value){

    if(interestsList.includes(value)){
      setInterest(interestsList.filter(key => value !== key));
    }
    else{
      interestsList.push(value);
      setInterest(interestsList);
    }
    setUpdate(true);
  }

  return role !== "subscriber" ? (
    <div className="changePasswordContainer">
      <div className="contentCenter">
        <h1>Profile</h1>
        <FormComponent
          values={values}
          ifUpdate = {ifUpdate}
          handleChange = {handleChange}
          handleCancel={handleCancel}
          onFinish={onFinish}
          role={role}
        />
      </div>
    </div>
  ) : (
    <div className="event-form-container">
      <div className="formCenter">
        <h1>Profile</h1>
        <FormComponent
          values={values}
          ifUpdate = {ifUpdate}
          handleChange = {handleChange}
          handleCancel={handleCancel}
          onFinish={onFinish}
          role={role}
        />
      </div>
      <div>
        <div className="formCenter">
          <h1>Select Interests</h1>
          <div className="interests-div">
            {interestList.map(interest=>{
              return <Interests key ={interest.id} value={interest.id} name = {interest.type} handleCheckboxChange={handleCheckboxChange} isChecked={values.interest.includes(interest.id)}/>
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
ProfileForm.propTypes = {
  values: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
  interestList: PropTypes.array,
  disableButton: PropTypes.bool,
  handleDisableChange: PropTypes.func,
};

function Interests(props){
  const {handleCheckboxChange, isChecked, value, name} = props;
  return (
    <div className="checkbox-div">
      <Checkbox defaultChecked={isChecked} onChange={()=>handleCheckboxChange(value)} key ={value}>{name}</Checkbox>      
    </div>
  )

}
Interests.propTypes = {
  handleCheckboxChange: PropTypes.func.isRequired,
  isChecked: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.number,
}

function FormComponent(props) {
  const { values, onFinish, handleCancel, role, handleChange, ifUpdate } = props;
  const {organization, contact_number, email, address, name} =values;
  

  return (
    <Form
          name="profile"
          initialValues={{
            organization: organization,
            name: name,
            contact_number: contact_number,
            email: email,
            address: address
          }}
          onChange = {handleChange}
          onFinish={onFinish}
        >
          {
            role === "subscriber"?(
              <Form.Item
              name="name"
              key={"name"}
              rules={[
                { required: true, message: "Please enter your name!"  },
                { pattern: NAME_VALIDATION, message: NAME_NO_SPECIAL},
                { pattern: WHITESPACE_VALIDATION, message: ONLY_WHITESPACE },
              ]}
          >
            <Input size = "large"  prefix = {<img src={userImg}/>} placeholder = "Name" className = 'input-style'/>
          </Form.Item>
            ):(
              <Form.Item
            name="organization"
            key={"organization"}
            rules={[
              { required: true, message: ORGANISATION_NAME  },
              { pattern: WHITESPACE_VALIDATION, message: ONLY_WHITESPACE },
            ]}
          >
            <Input size = "large"  prefix = {<img src={organisationImg}/>} placeholder = "Organisation Name" className = 'input-style'/>
          </Form.Item>
            )
          }
          <Form.Item
            name="email"
            key={"email"}
          >
            <Input disabled prefix={<img src={emailImg} />} size = "large" placeholder = "Email" className = 'input-style'/>
          </Form.Item>
          <Form.Item
            name="contact_number"
            key={"contact_number"}
            rules={[
              { required: true, message: CONTACT_NO },
              {
                pattern:PHONE_VALIDATION,
                min: 10,
                message: INVALID_CONATCT
              }
              
            ]}
          >
            <Input prefix={<img src = {phoneImg} />} size = "large" minLength = {10}
              maxLength = {10}
            placeholder = "Contact No." className = 'input-style'/>
          </Form.Item>
          <Form.Item
            name="address"
            key="address"
            rules={[
              {
                required: true,
                message: role !== "subscriber"? ORGANISATION_ADDRESS : "Please enter your address!"
              },
              { pattern: WHITESPACE_VALIDATION, message: ONLY_WHITESPACE },
            ]}
          >
            <Input.TextArea placeholder = "Enter Address" autoSize = {{minRows:4, maxRows:4}} className = "input-textarea"/>
          </Form.Item>
          <div className="button-container">
            <Button type="default" onClick={handleCancel}>
              Cancel
            </Button>
            <Button disabled = {!ifUpdate} htmlType="submit" type="primary" className="save-button">
              Update
            </Button>
          </div>
        </Form>
  );
}

FormComponent.propTypes = {
  values: PropTypes.object.isRequired,
  handleCancel: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  role: PropTypes.string,
  handleChange: PropTypes.func,
  ifUpdate: PropTypes.bool,
}