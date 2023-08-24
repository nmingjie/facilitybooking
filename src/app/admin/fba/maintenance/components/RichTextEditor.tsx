"use client";

import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { cn } from "@/lib/utils"
import dynamic from 'next/dynamic';

type RichTextEditorSchema = {
  props: PropsParamsSchema
};

type PropsParamsSchema = {
  readonly value: string,
  readonly defaultValue?: string,
  readonly readOnly?: boolean,
  readonly placeholder?: string,
  readonly className?: string,
  readonly theme?: string,
  readonly style?: object
  readonly onChange?: ((content: any, delta: any, source: any, editor: any) => void);
}
const ReactQuill = dynamic(
	() => {
		return import('react-quill');
	},
	{ ssr: false }
);

export function RichTextEditor({...props}: PropsParamsSchema) {

  return (
    <>
    <style>
     {`
      .ql-hidden{
        display:none;
      }
      .ql-editor{
        min-height:80px;
      }
     `}
    </style>
    <div className="rich-text-editor">
      <ReactQuill
        placeholder="Please enter content"
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            ["link", "image"],
            ["clean"],
          ],
        }}
        {...props}
        onChange = {props.onChange}
        className={cn(props.className)}
      />
    </div>
    </>
  );
}
