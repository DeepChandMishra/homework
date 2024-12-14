import React, { useState } from 'react';
import SearchInput from './SearchInput';
import Conversation from './Conversation';

const Sidebar = ({ onSelectConversation, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="sidebar flex flex-col w-1/4 bg-gray-200 p-4">
      {/* Search Bar */}
      <SearchInput searchQuery={searchQuery} onSearch={handleSearch} />

      {/* Divider */}
      <hr className="my-4" />

      {/* Conversations List */}
      <Conversation
        onSelectConversation={onSelectConversation}
      />
    </div>
  );
};

export default Sidebar;
