import React from 'react';
import { Metadata } from "next";
import Contact from "./pageClient";

export const metadata: Metadata = {
  title: 'Contact | Squsts',
}

export default async function Page() {
  return (
    <Contact></Contact>
  )
}