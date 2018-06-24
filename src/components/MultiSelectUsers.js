import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import { teamMembersQuery } from '../graphql/team';

const MultiSelectUsers = ({
  data: { loading, teamMembers = [] },
  value,
  handleChange,
  placeholder,
  currentUserId,
}) => loading ? null : (
  <Dropdown
    value={value}
    onChange={handleChange}
    placeholder={placeholder}
    fluid
    multiple
    search
    selection
    options={
      teamMembers
        .filter(member => member.id !== currentUserId)
        .map(tm => ({ key: tm.id, value: tm.id, text: tm.username }))
    }
  />
);

export default graphql(
  teamMembersQuery,
  {
    options: ({ teamId }) => ({ 
      variables: { teamId },
    }),
  }
)(MultiSelectUsers);
