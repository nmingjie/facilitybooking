"use client";

import * as React from "react";
import { Disclosure } from "@headlessui/react";

export default function SGDS(props: any) {
  return (
    <Disclosure as="nav">
      {({ open }) => (
        <div className="fixed top-0 bg-white inset-x-0 z-50 shadow-xl">
          <sgds-masthead></sgds-masthead>
        </div>
      )}
    </Disclosure>
  );
}