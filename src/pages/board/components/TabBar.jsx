
import React from 'react';
import {
  TabContainer,
  Tab,
  HotIcon,
  CreateBtnContainer,
} from '@/pages/board/styles/commonStyles';
import SearchPC from '@/pages/search/SearchPC';
import FloatingButton from '@/pages/board/components/FloatingButton';
import useResponsive from '@/pages/board/hooks/useResponsive'

const TabBar = ({ activeTab, onTabChange, showFloatingButton, isScrollTop = true }) => {
  const tabs = [
    { id: 'general', label: '일반' },
    { id: 'hot', label: 'Hot', icon: '🔥' },
    { id: 'promotion', label: '홍보' }
  ];

  const isPC = useResponsive();

  return (
    <>
      {/* isScrollTop에 따라 margin 변경 */}
      {isPC && (
        <div 
          style={{
            margin: isScrollTop ? '60px 100px 60px 60px' : '60px 100px 20px 60px',
            transition: 'margin 0.3s ease-in-out',
          }}
        >
          <SearchPC/>
        </div>
      )}

      {/* PC && isScrollTop일 때만 */}
      <div
        style={{
          maxHeight: isPC && isScrollTop ? '50px' : '0px',
          opacity: isPC && isScrollTop ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
        }}
      >
        <div style={{marginLeft: '60px', fontSize: '24px', fontWeight: 'bold', marginBottom: '12px'}}>
          게시판
        </div>
      </div>
      
      <CreateBtnContainer>
        <TabContainer>
          {tabs.map(tab => (
            <Tab
              key={tab.id}
              active={activeTab === tab.id}
              type={tab.id}
              onClick={() => onTabChange(tab.id)}
            >
              {!isPC && tab.icon && <HotIcon>{tab.icon}</HotIcon>}
              {tab.label}
            </Tab>
          ))}
        </TabContainer>
        {isPC && (
          <FloatingButton 
            show={showFloatingButton} 
            category={activeTab} 
          />
        )}
      </CreateBtnContainer>
    </>
  );
};

export default TabBar;