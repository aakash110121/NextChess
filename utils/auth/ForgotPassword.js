import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { auth } from './FirebaseCredentials'
import { sendPasswordResetEmail } from 'firebase/auth'; // Import the function

export default function ForgotPassword({ emailValue, modalOpen, toggleModal }) {
  const [resetPasswordStatus, setResetPasswordStatus] = useState('');

  async function handleForgotPassword(event) {
    event.preventDefault();
    const { email } = event.target.elements;

    try {
      // Use the imported function with the auth object
      await sendPasswordResetEmail(auth, email.value);
      setResetPasswordStatus('A password reset link has been sent to your email.');
    } catch (resetError) {
      setResetPasswordStatus('Error sending password reset email.');
    }
  }

  return (
    <Modal isOpen={modalOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Forgot Password?</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleForgotPassword}>
          {resetPasswordStatus && (
            <Alert color={resetPasswordStatus.startsWith('Error') ? 'danger' : 'success'}>
              {resetPasswordStatus}
            </Alert>
          )}
          <FormGroup>
            <Label for="forgotPasswordEmail">Email</Label>
            <Input
              type="email"
              name="email"
              id="forgotPasswordEmail"
              placeholder="Email"
              defaultValue={emailValue}
              required
            />
          </FormGroup>
          <Button type="submit">Send Reset Link</Button>
        </Form>
      </ModalBody>
    </Modal>
  );
}
