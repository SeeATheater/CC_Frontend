import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '@/style/Theme.jsx';
import GlobalStyle from '@/style/GlobalStyle.jsx';
import ResponsiveView from '@/style/ResponsiveView.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext.jsx';
import App from '@/App.jsx';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<GlobalStyle />
			<ResponsiveView />
			<BrowserRouter>
				<AuthProvider>
					<App />
				</AuthProvider>
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>,
);
