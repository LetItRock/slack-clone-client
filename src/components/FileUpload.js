import React from 'react';
import DropZone from 'react-dropzone';
import { graphql } from 'react-apollo';
import { createFileMessageMutation } from '../graphql/message';

const onDrop = (channelId, mutate) => async ([file]) => {
  const response = await mutate({
    variables: {
      channelId,
      file,
    },
  });
  console.log(response);
};

const FileUpload = ({ children, disableClick, mutate, channelId, style = {} }) => (
  <DropZone style={style} onDrop={onDrop(channelId, mutate)} className="ignore" disableClick={disableClick}>
    {children}
  </DropZone>
);

export default graphql(createFileMessageMutation)(FileUpload);
