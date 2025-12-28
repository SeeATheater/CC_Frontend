import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MyQueryList from '@/pages/mypage/query/pages/MyQueryList';
import CreateQuery from '@/pages/mypage/query/pages/CreateQuery';
import SuccessQuery from '@/pages/mypage/query/pages/SuccessQuery';
import QueryDetail from '@/pages/mypage/query/pages/QueryDetail';

const MyQueryPage = () => {
  return (
    <Routes>
      <Route path="/" element={<MyQueryList />} />
      <Route path="/create" element={<CreateQuery />} />
      <Route path="/success" element={<SuccessQuery />} />
      <Route path="/:queryId" element={<QueryDetail />} />
    </Routes>
  );
};

export default MyQueryPage;
