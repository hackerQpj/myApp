import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // 引入样式

export default function NewsEditor(props) {
  const { reactQuillRef, current, previewContent } = props || {};
  const [value, setValue] = useState(previewContent);

  useEffect(() => {
    setValue(previewContent);
  }, [previewContent]);

  const handleChange = (content, delta, source, editor) => {
    setValue(content);
  };

  return (
    <ReactQuill
      value={value}
      onChange={handleChange}
      style={{ marginTop: "18px", display: current === 1 ? undefined : "none" }}
      ref={reactQuillRef}
    />
  );
}
