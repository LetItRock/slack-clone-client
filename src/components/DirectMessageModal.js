import React from 'react';
import { graphql } from 'react-apollo';
import { Form, Button, Modal, Input } from 'semantic-ui-react';
import Downshift from 'downshift';
import { withRouter } from 'react-router-dom';
import { teamMembersQuery } from '../graphql/team';

const DirectMessageModal = ({
  teamId,
  open,
  onClose,
  data: { loading, teamMembers },
  history,
}) => (
  <Modal open={open} onClose={onClose} className="scrolling">
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <Form>
          <Form.Field>
            {!loading &&
              <Downshift
                onChange={selectedUser => {
                  history.push(`/view-team/user/${teamId}/${selectedUser.id}`);
                  onClose();
                }}
              >
                {({
                  getInputProps,
                  getItemProps,
                  isOpen,
                  inputValue,
                  selectedItem,
                  highlightedIndex,
                }) => (
                  <div>
                    <Input fluid {...getInputProps({ placeholder: 'Favorite fruit ?' })} />
                    {isOpen ? (
                      <div style={{ border: '1px solid #ccc' }}>
                        {teamMembers
                          .filter(
                            i =>
                              !inputValue ||
                              i.username.toLowerCase().includes(inputValue.toLowerCase()),
                          )
                          .map((item, index) => (
                            <div
                              {...getItemProps({ item })}
                              key={item.id}
                              style={{
                                backgroundColor:
                                  highlightedIndex === index ? 'gray' : 'white',
                                fontWeight: selectedItem === item ? 'bold' : 'normal',
                              }}
                            >
                              {item.username}
                            </div>
                          ))
                        }
                      </div>
                    ) : null}
                  </div>
                )}
              </Downshift>
            }
          </Form.Field>
          <Button onClick={onClose} fluid>Cancel</Button>
        </Form>
      </Modal.Description>
    </Modal.Content>
  </Modal>
);

export default withRouter(graphql(teamMembersQuery)(DirectMessageModal));
