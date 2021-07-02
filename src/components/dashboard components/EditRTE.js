import React, { useState, useEffect } from 'react';
import RichTextEditor from 'react-rte';

export default function EditRTE({ post, sendData }) {
  const [content, setContent] = useState(
    RichTextEditor.createValueFromString(post.content, 'html')
  );

  function onChangeContent(value) {
    setContent(value);
    sendData(value);
  }

  useEffect(() => {
    console.log(content.toString('html'));
  }, [content]);

  return (
    <React.Fragment>
      <div>
        <RichTextEditor value={content} onChange={onChangeContent} />
      </div>
    </React.Fragment>
  );
}
