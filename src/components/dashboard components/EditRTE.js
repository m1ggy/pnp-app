import React, { useState } from 'react';
import RichTextEditor from 'react-rte';

export default function EditRTE({ post, sendData }) {
  const [content, setContent] = useState(
    RichTextEditor.createValueFromString(post.content, 'html')
  );

  function onChangeContent(value) {
    setContent(value);
    sendData(value);
  }

  return (
    <>
      <div>
        <RichTextEditor value={content} onChange={onChangeContent} />
      </div>
    </>
  );
}
