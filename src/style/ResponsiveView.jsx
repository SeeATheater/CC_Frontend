import { createGlobalStyle } from 'styled-components';

const ResponsiveView = createGlobalStyle`
  .only-mobile {
    display: block !important;

    @media (min-width: 768px) {
      display: none !important;
    }
  }

  .only-mobile-inline {
    display: inline !important;

    @media (min-width: 768px) {
      display: none !important;
    }
  }
  .only-web-inline {
    display: none !important;

    @media (min-width: 768px) {
      display: inline !important;
    }
  }
  .only-web-flex {
    display: none !important;

    @media (min-width: 768px) {
      display: flex !important;
    }
}
      .only-mobile-flex {
    display: flex !important;

    @media (min-width: 768px) {
      display: none !important;
    }
}
  .only-web {
    display: none !important;


    @media (min-width: 768px) {
      display: block !important;
    }
  }
`;

export default ResponsiveView;
