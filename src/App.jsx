import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import { authenticatedFetch } from '@shopify/app-bridge-utils';
import { Redirect } from '@shopify/app-bridge/actions';
import { AppProvider as PolarisProvider } from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { ServiceUnavailable } from './components/serviceUnavailable/ServiceUnavailable.jsx';
import './css/main.css';

export default function App() {
    return (
        <PolarisProvider i18n={translations}>
            <AppBridgeProvider
                config={{
                    apiKey: process.env.SHOPIFY_API_KEY,
                    host: new URL(location).searchParams.get('host'),
                    forceRedirect: true,
                }}
            >
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="expenses" element={<ServiceUnavailable />} />
                    </Routes>
                </BrowserRouter>
            </AppBridgeProvider>
        </PolarisProvider>
    );
}

export function userLoggedInFetch(app) {
    const fetchFunction = authenticatedFetch(app);

    return async (uri, options) => {
        const response = await fetchFunction(uri, options);
        console.log(response.status);
        if (response.status === 503) {
            const authUrlHeader = response.headers.get('X-Shopify-API-Request-Failure-Reauthorize-AddStore');

            const redirect = Redirect.create(app);
            redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/expenses`);
            return null;
        }
        if (response.headers.get('X-Shopify-API-Request-Failure-Reauthorize') === '1') {
            const authUrlHeader = response.headers.get('X-Shopify-API-Request-Failure-Reauthorize-AddStore');

            const redirect = Redirect.create(app);
            redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
            return null;
        }

        return response;
    };
}
